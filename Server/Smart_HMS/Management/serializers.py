from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime


class RoleBasedTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        data['id'] = self.user.id
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['is_superuser'] = self.user.is_superuser
        data['full_name'] = f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
        
        return data

class UserSerializers(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ['first_name','last_name','email','password','username','address','phone','photo','id','role']

        extra_kwargs = {
            'password': {'write_only': True,'required': False},
            'username': {'validators': []}
        }


class PatientSerializer(serializers.ModelSerializer):

    user = UserSerializers()

    class Meta:
        model = PatientModel
        fields = ['user','gender','DOB','blood_group','id','patient_code','age','weight','height']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        user = UserModel.objects.create_user(password=password,role='patient',**user_data)
        patient = PatientModel.objects.create(user=user,patient_code=f"PAT{user.id:05d}",**validated_data)
        return patient
    
    def update(self, instance, validated_data):

        user_data = validated_data.pop('user', None)

        if user_data:
            user = instance.user

            for key, value in user_data.items():

                if key == 'password':
                    user.set_password(value)
                else:
                    setattr(user, key, value)

            user.save()

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance
    

class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = DepartmentModel
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializers()

    class Meta:
        model = DoctorModel
        fields = ['department','user','qualification','specialization','con_fee','id']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        password = user_data.pop('password')

        if not user_data.get('username'):
            user_data['username'] = user_data['email']

        user = UserModel.objects.create_user(password=password,role='doctor',**user_data)
        doctor = DoctorModel.objects.create(user=user,**validated_data)
        return doctor
        
    def update(self, instance, validated_data):

        user_data = validated_data.pop('user', None)

        if user_data:
            user = instance.user

            for key, value in user_data.items():

                if key == 'password':
                    user.set_password(value)
                else:
                    setattr(user, key, value)

            user.save()

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance

class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializers()

    class Meta:
        model = StaffModel
        fields = ['id', 'user', 'designation', 'salary', 'profile']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        # Safely get the password, throw an error if it's missing during creation
        password = user_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({
                "user": {"password": ["This field is required when adding a new staff member."]}
            })

        # --- SET ROLE HERE ---
        # Force the role to 'staff' before creating the User instance
        user_data['role'] = 'staff'

        user = UserModel.objects.create(**user_data)
        user.set_password(password)
        user.save()

        # Removed role='staff' from here to prevent TypeError (assuming it belongs to UserModel)
        return StaffModel.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        if user_data:
            user = instance.user

            # --- ENFORCE ROLE HERE ---
            # Ensure the role cannot be accidentally changed to something else during an update
            user_data['role'] = 'staff'

            for attr, value in user_data.items():
                if attr == 'password':
                    user.set_password(value)
                else:
                    setattr(user, attr, value)

            user.save()

        instance.designation = validated_data.get('designation', instance.designation)
        instance.salary = validated_data.get('salary', instance.salary)
        
        if 'profile' in validated_data:
            instance.profile = validated_data['profile']

        instance.save()

        return instance
    
class DoctorListSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source='user.get_full_name',read_only=True)
    department_name = serializers.CharField(source='department.dep_name',read_only=True)
    profile = serializers.ImageField(
        source='user.photo',
        read_only=True
    )

    class Meta:
        model = DoctorModel
        fields = ['id','doctor_name','department_name','specialization','qualification','con_fee','profile']

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentModel
        fields = '__all__'
        read_only_fields = ['booked_by', 'status', 'created_at']

    def validate(self, data):
        doctor = data.get('doctor')
        appointment_date = data.get('appointment_date')
        token_number = data.get('token_number')
        patient = data.get('patient')

        # 1. Check if the doctor is on leave
        is_on_leave = DoctorLeaveModel.objects.filter(
            doctor=doctor, 
            leave_date=appointment_date
        ).exists()
        
        if is_on_leave:
            raise serializers.ValidationError({
                "appointment_date": "The selected doctor is on leave on this date."
            })

        # 2. Check if the doctor works on this day
        day_name = appointment_date.strftime("%A")
        schedule = DoctorScheduleModel.objects.filter(
            doctor=doctor, 
            day=day_name
        ).first()

        if not schedule:
            raise serializers.ValidationError({
                "appointment_date": f"The doctor does not have a schedule for {day_name}s."
            })

        # 3. Validate Token Number bounds
        if token_number:
            start = datetime.combine(appointment_date, schedule.start_time)
            end = datetime.combine(appointment_date, schedule.end_time)
            total_minutes = (end - start).total_seconds() / 60
            max_tokens = int(total_minutes // schedule.slot_duration)

            if token_number < 1 or token_number > max_tokens:
                raise serializers.ValidationError({
                    "token_number": f"Invalid token. Must be between 1 and {max_tokens} for this shift."
                })

        # 4. Graceful check for duplicate token (catches it before DB throws IntegrityError)
        token_exists = AppointmentModel.objects.filter(
            doctor=doctor,
            appointment_date=appointment_date,
            token_number=token_number,
            status__in=['pending', 'confirmed']
        ).exists()

        if token_exists:
            raise serializers.ValidationError({
                "token_number": "This token is already booked. Please refresh and select another."
            })

        # 5. Graceful check for duplicate patient booking
        patient_already_booked = AppointmentModel.objects.filter(
            patient=patient,
            doctor=doctor,
            appointment_date=appointment_date,
            status__in=['pending', 'confirmed']
        ).exists()

        if patient_already_booked:
            raise serializers.ValidationError({
                "non_field_errors": "This patient already has an active appointment with this doctor on this date."
            })

        return data

class DoctorScheduleSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source='doctor.user.get_full_name',read_only=True)

    class Meta:
        model = DoctorScheduleModel
        fields = '__all__'

class MyAppointmentSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source='doctor.user.get_full_name',read_only=True)
    department = serializers.CharField(source='doctor.department.dep_name',read_only=True)

    class Meta:
        model = AppointmentModel
        fields = '__all__'

class MedicalRecordSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source='doctor.user.get_full_name',read_only=True)

    class Meta:
        model = MedicalRecordModel
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.get_full_name',read_only=True)

    class Meta:
        model = PrescriptionModel
        fields = '__all__'


class LabTestSerializer(serializers.ModelSerializer):

    patient_name = serializers.CharField(source='patient.user.get_full_name',read_only=True)
    patient_code = serializers.CharField(source='patient.patient_code',read_only=True)

    class Meta:
        model = LabTestModel
        fields = '__all__'