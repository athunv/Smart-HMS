from django.shortcuts import render,get_object_or_404
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .serializers import RoleBasedTokenSerializer

from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveUpdateDestroyAPIView,ListCreateAPIView
from rest_framework.viewsets import ModelViewSet
from datetime import datetime, timedelta
from django.utils import timezone

class RoleBasedLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = RoleBasedTokenSerializer

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        user = request.user

        if user.role == 'patient':
            profile = PatientModel.objects.get(user=user)
            serializer = PatientSerializer(profile)

        elif user.role == 'doctor':
            profile = DoctorModel.objects.get(user=user)
            serializer = DoctorSerializer(profile)

        elif user.role == 'staff':
            profile = StaffModel.objects.get(user=user)
            serializer = StaffSerializer(profile)

        elif user.role == 'pharmacist':
            return Response({
                "user": UserSerializers(user).data,
                "role": "pharmacist"
            })

        elif user.role == 'lab':
            return Response({
                "user": UserSerializers(user).data,
                "role": "lab"
            })

        else:
            return Response(
                {"message": "Profile not found"},
                status=404
            )

        return Response(serializer.data)



class PatientCreateView(APIView):

    def post(self,request):

        serializer = PatientSerializer(data=request.data)

        if serializer.is_valid():
            patient = serializer.save()
            return Response(PatientSerializer(patient).data,status=status.HTTP_201_CREATED)
        print(serializer.errors) 
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(slef,request,id=None):

        if id:
            patient = get_object_or_404(PatientModel,id=id)
            serializer = PatientSerializer(patient)
            return Response(serializer.data)

        patients = PatientModel.objects.select_related(
                'user'
            ).all()
        serializer = PatientSerializer(patients,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def put(self,request,id):

        patient = PatientModel.objects.get(id=id)

        serializer = PatientSerializer(instance=patient,data=request.data,partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,id):
        try:
            patient = PatientModel.objects.get(id=id)
            patient.delete()
            return Response(
                {"message": "Patient Deleted Successfully"},
                status=status.HTTP_200_OK
            )
        
        except PatientModel.DoesNotExist:
            return Response({"error": "Patient not found"},status=status.HTTP_404_NOT_FOUND)
        
class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        role_map = {
            'patient': (PatientModel, PatientSerializer),
            'doctor': (DoctorModel, DoctorSerializer),
            'staff': (StaffModel, StaffSerializer),
        }

        if user.role in role_map:
            model, serializer_class = role_map[user.role]

            instance = model.objects.get(user=user)

            serializer = serializer_class(
                instance,
                data=request.data,
                partial=True
            )

        else:
            serializer = UserSerializers(
                user,
                data=request.data,
                partial=True
            )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

class DepartmentCreateView(APIView):

    def post(self,request):
        serializer = DepartmentSerializer(data=request.data)

        if serializer.is_valid():
            department = serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):

        department = DepartmentModel.objects.all()
        serializer = DepartmentSerializer(department,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def put(self,request,id):

        department = get_object_or_404(DepartmentModel,id=id)
        serializer = DepartmentSerializer(department,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        department = get_object_or_404(DepartmentModel, id=id)
        department.delete()
        return Response(
            {'message': 'Department Deleted'},
            status=status.HTTP_200_OK
        )
    
    
class DoctorCreateView(APIView):

    def post(self,request):
        serializer = DoctorSerializer(data=request.data)

        if serializer .is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

    def get(self, request, id=None):

        if id:
            doctor = get_object_or_404(DoctorModel, id=id)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data)

        doctor = DoctorModel.objects.select_related(
            'user',
            'department'
        ).all()
        serializer = DoctorSerializer(doctor, many=True)
        return Response(serializer.data)
            
    def put(self,request,id):

        doctor = get_object_or_404(DoctorModel,id=id)
        serializer = DoctorSerializer(doctor,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"Doctor Updateded Successfully"},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,id):

        doctor = get_object_or_404(DoctorModel,id=id)
        doctor.delete()
        return Response({"Doctor Deleted Succefully"},status=status.HTTP_200_OK)
    

class DoctorListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        doctors = DoctorModel.objects.all()
        serializer = DoctorListSerializer(doctors,many=True)
        return Response(serializer.data)
    
class DoctorDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, id):

        doctor = DoctorModel.objects.get(id=id)

        serializer = DoctorListSerializer(doctor)

        return Response(serializer.data)


class AppointmentCreateView(CreateAPIView):

    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        serializer.save( booked_by=self.request.user)

class StaffView(ListCreateAPIView):

    permission_classes = [IsAuthenticated]

    queryset = StaffModel.objects.all()
    serializer_class = StaffSerializer

    def perform_create(self, serializer):
        serializer.save()

class StaffDetailView(RetrieveUpdateDestroyAPIView):

    permission_classes = [IsAuthenticated]

    queryset = StaffModel.objects.all()
    serializer_class = StaffSerializer

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()


class AppointmentListView(ListAPIView):

    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer


# Logged-in patient sees only their bookings.
class MyAppointmentsView(ListAPIView):

    serializer_class = AppointmentSerializer

    def get_queryset(self):

        return AppointmentModel.objects.filter(patient__user=self.request.user).order_by('-appointment_date')
    
class DoctorAppointmentsView(ListAPIView):

    serializer_class = AppointmentSerializer

    def get_queryset(self):

        return AppointmentModel.objects.filter(
            doctor__user=self.request.user).order_by('appointment_date')
    
class DoctorScheduleViewSet(ModelViewSet):

    queryset = DoctorScheduleModel.objects.all()
    serializer_class = DoctorScheduleSerializer

class AvailableSlotsView(APIView):

    def get(self, request, doctor_id, date):

        doctor = DoctorModel.objects.get(id=doctor_id)

        booking_date = datetime.strptime(
            date,
            "%Y-%m-%d"
        ).date()

        day_name = booking_date.strftime("%A")

        schedule = DoctorScheduleModel.objects.filter(
            doctor=doctor,
            day=day_name
        ).first()

        if not schedule:
            return Response([])

        start = datetime.combine(
            booking_date,
            schedule.start_time
        )

        end = datetime.combine(
            booking_date,
            schedule.end_time
        )

        slots = []

        # Generate all possible time slots for the day
        while start < end:
            slots.append(start.strftime("%H:%M"))
            start += timedelta(minutes=schedule.slot_duration)

        # --- THE FIX ---
        # Instead of looking for a time field, we get the booked token numbers
        booked_tokens = AppointmentModel.objects.filter(
            doctor=doctor,
            appointment_date=booking_date
        ).values_list(
            'token_number',
            flat=True
        )

        available_slots = []
        
        # Loop through the generated slots and map them to token numbers (1, 2, 3...)
        for index, time_str in enumerate(slots):
            # We assume tokens start at 1 (Token 1 = Slot index 0)
            token_number = index + 1 
            
            # If the token is not in the booked list, the slot is available
            if token_number not in booked_tokens:
                available_slots.append(time_str)

        return Response(available_slots)
    
class ActiveConsultationView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        patient = PatientModel.objects.get(user=request.user)
        appointments = AppointmentModel.objects.filter(patient=patient,status='confirmed',appointment_date=timezone.now().date())
        serializer = MyAppointmentSerializer(appointments,many=True)
        return Response(serializer.data)
    
class MyMedicalRecordsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        patient = PatientModel.objects.get(user=request.user)

        records = MedicalRecordModel.objects.filter(patient=patient).order_by('-created_at')

        serializer = MedicalRecordSerializer(records,many=True)

        return Response(serializer.data)
    
class MyPrescriptionsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        patient = PatientModel.objects.get(
            user=request.user
        )

        prescriptions = PrescriptionModel.objects.filter(
            patient=patient
        ).order_by('-created_at')

        serializer = PrescriptionSerializer(
            prescriptions,
            many=True
        )

        return Response(serializer.data)
    
class MyLabTestsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        patient = PatientModel.objects.get(
            user=request.user
        )

        tests = LabTestModel.objects.filter(
            patient=patient
        )

        serializer = LabTestSerializer(
            tests,
            many=True
        )

        return Response(serializer.data)