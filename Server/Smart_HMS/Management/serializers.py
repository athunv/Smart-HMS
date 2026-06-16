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