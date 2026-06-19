from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

    class Meta:
        model = DoctorModel
        fields = ['id','doctor_name','department_name','specialization','qualification','con_fee']

class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = AppointmentModel
        fields = '__all__'

    def create(self, validated_data):

        doctor = validated_data['doctor']
        appointment_date = validated_data['appointment_date']

        last_token = AppointmentModel.objects.filter(doctor=doctor,appointment_date=appointment_date).order_by('-token_number').first()

        token_number = 1

        if last_token:
            token_number = last_token.token_number + 1

        appointment = AppointmentModel.objects.create(token_number=token_number,**validated_data)

        return appointment


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