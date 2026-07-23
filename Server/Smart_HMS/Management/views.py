from django.shortcuts import render,get_object_or_404
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action

# Create your views here.

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .serializers import RoleBasedTokenSerializer
from rest_framework.exceptions import ValidationError


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
            return Response({"user": UserSerializers(user).data,"role": "pharmacist"})

        elif user.role == 'lab':
            return Response({ "user": UserSerializers(user).data,"role": "lab"})

        else:
            return Response({"message": "Profile not found"}, status=404)

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

        patients = PatientModel.objects.select_related('user').all()
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
            return Response( {"message": "Patient Deleted Successfully"},status=status.HTTP_200_OK)
        
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

            serializer = serializer_class(instance,data=request.data,partial=True)

        else:
            serializer = UserSerializers(user,data=request.data,partial=True)

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
        return Response({'message': 'Department Deleted'},status=status.HTTP_200_OK)
    
    
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

        doctor = DoctorModel.objects.select_related('user','department').all()
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

        user = self.request.user

        # Patient books for themselves
        if user.role == "patient":

            try:
                patient = PatientModel.objects.get(user=user)
            except PatientModel.DoesNotExist:
                raise ValidationError({
                    "detail": "Patient profile not found."
                })

            serializer.save(patient=patient,booked_by=user)
        elif user.role in ["staff"] or user.is_superuser:
            serializer.save(booked_by=user)
        else:
            raise ValidationError({"detail": "You are not allowed to book appointments."})

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
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        user = self.request.user

        if getattr(user, 'role', None) == 'doctor':

            return AppointmentModel.objects.filter(doctor__user=user)


        elif getattr(user, 'role', None) == 'staff' or user.is_superuser:
            return AppointmentModel.objects.all()

        return AppointmentModel.objects.none()


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
        try:
            doctor = DoctorModel.objects.get(id=doctor_id)
        except DoctorModel.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=404)

        booking_date = datetime.strptime(date, "%Y-%m-%d").date()

        is_on_leave = DoctorLeaveModel.objects.filter(
            doctor=doctor,
            from_date__lte=booking_date,
            to_date__gte=booking_date,
            status="approved"      # or include "pending" if you want pending leave to block bookings
        ).exists()

        if is_on_leave:
            return Response(
                {
                    "message": "Doctor is on leave on this date.",
                    "available_slots": []
                },
                status=200
            )

        day_name = booking_date.strftime("%A")
        schedule = DoctorScheduleModel.objects.filter(doctor=doctor, day=day_name).first()

        if not schedule:
             return Response({
                "message": "Doctor does not consult on this day.",
                "available_slots": []
            }, status=200)

        # 3. Generate Time Slots
        start = datetime.combine(booking_date, schedule.start_time)
        end = datetime.combine(booking_date, schedule.end_time)
        
        slots = []
        while start < end:
            slots.append(start.strftime("%H:%M"))
            start += timedelta(minutes=schedule.slot_duration)

        # 4. Fetch Active Bookings (ignore cancelled/completed ones)
        booked_tokens = AppointmentModel.objects.filter(
            doctor=doctor,
            appointment_date=booking_date,
            status__in=['pending', 'confirmed']
        ).values_list('token_number', flat=True)

        all_slots_with_status = []
        
        # 5. Map all slots to tokens with a boolean flag
        for index, time_str in enumerate(slots):
            token_number = index + 1 
            all_slots_with_status.append({
                "token_number": token_number,
                "time": time_str,
                "is_booked": token_number in booked_tokens # Boolean flag
            })

        return Response({"available_slots": all_slots_with_status}, status=200)
    


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
    

class DoctorLeaveViewSet(viewsets.ModelViewSet):

    serializer_class = DoctorLeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.is_superuser:
            return DoctorLeaveModel.objects.select_related(
                "doctor",
                "doctor__user"
            )

        if user.role == "doctor":
            return DoctorLeaveModel.objects.filter(
                doctor__user=user
            ).select_related(
                "doctor",
                "doctor__user"
            )

        return DoctorLeaveModel.objects.none()

    def perform_create(self, serializer):

        if self.request.user.role == "doctor":

            doctor = DoctorModel.objects.get(user=self.request.user)

            serializer.save(
                doctor=doctor
            )

        else:
            serializer.save()

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):

        leave = self.get_object()

        if not request.user.is_superuser:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        appointment_exists = AppointmentModel.objects.filter(
            doctor=leave.doctor,
            appointment_date__range=[
                leave.from_date,
                leave.to_date
            ],
            status__in=["pending", "confirmed"]
        ).exists()

        if appointment_exists:
            return Response(
                {
                    "detail":
                    "Doctor has appointments during this leave period."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        leave.status = "approved"
        leave.approved_by = request.user
        leave.remarks = request.data.get("remarks", "")
        leave.save()

        return Response(
            {
                "message": "Leave approved successfully."
            }
        )

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):

        leave = self.get_object()

        if not request.user.is_superuser:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        leave.status = "rejected"
        leave.approved_by = request.user
        leave.remarks = request.data.get("remarks", "")
        leave.save()

        return Response(
            {
                "message": "Leave rejected successfully."
            }
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):

        leave = self.get_object()

        if leave.doctor.user != request.user:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        if leave.status == "approved":
            return Response(
                {
                    "detail":
                    "Approved leave cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        leave.status = "cancelled"
        leave.save()

        return Response(
            {
                "message": "Leave cancelled successfully."
            }
        )


class MedicineCategoryView(APIView):

    def post(self,request,*args,**kwargs):

        serializer = MedicineCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


    def get(self,request,*args,**kwargs):

        data = MedicineCategoryModel.objects.all()
        serializer = MedicineCategorySerializer(data,many=True)
        return Response(serializer.data)

class MedicineCategoryListCreateView(ListCreateAPIView):
    """Handles GET (list all) and POST (create new) for Categories"""
    queryset = MedicineCategoryModel.objects.all()
    serializer_class = MedicineCategorySerializer

class MedicineCategoryDetailView(RetrieveUpdateDestroyAPIView):
    """Handles GET (retrieve one), PUT/PATCH (update), and DELETE for a Category"""
    queryset = MedicineCategoryModel.objects.all()
    serializer_class = MedicineCategorySerializer

# ------------------------------------------------------------------
# 2. MEDICINE VIEWS
# ------------------------------------------------------------------
class MedicineListCreateView(ListCreateAPIView):
    """Handles GET (list all) and POST (create new) for Medicines"""
    queryset = MedicineModel.objects.all()
    serializer_class = MedicineSerializer

class MedicineDetailView(RetrieveUpdateDestroyAPIView):
    """Handles GET (retrieve one), PUT/PATCH (update), and DELETE for a Medicine"""
    queryset = MedicineModel.objects.all()
    serializer_class = MedicineSerializer

# ------------------------------------------------------------------
# 3. BATCH VIEWS
# ------------------------------------------------------------------
class MedicineBatchListCreateView(ListCreateAPIView):
    """Handles GET (list all) and POST (create new) for Batches"""
    queryset = MedicineBatchModel.objects.all()
    serializer_class = MedicineBatchSerializer

class MedicineBatchDetailView(RetrieveUpdateDestroyAPIView):
    """Handles GET (retrieve one), PUT/PATCH (update), and DELETE for a Batch"""
    queryset = MedicineBatchModel.objects.all()
    serializer_class = MedicineBatchSerializer