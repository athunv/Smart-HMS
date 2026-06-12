from django.shortcuts import render,get_object_or_404
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .serializers import RoleBasedTokenSerializer

from rest_framework.generics import CreateAPIView,ListAPIView
from rest_framework.viewsets import ModelViewSet
from datetime import datetime, timedelta

class RoleBasedLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = RoleBasedTokenSerializer

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
    




class AppointmentCreateView(CreateAPIView):

    queryset = AppointmentModel.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        serializer.save( booked_by=self.request.user)



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

        while start < end:
            slots.append(
                start.strftime("%H:%M")
            )

            start += timedelta(
                minutes=schedule.slot_duration
            )

        booked_slots = AppointmentModel.objects.filter(
            doctor=doctor,
            appointment_date=booking_date
        ).values_list(
            'appointment_time',
            flat=True
        )

        booked_slots = [
            t.strftime("%H:%M")
            for t in booked_slots
        ]

        available_slots = [
            slot
            for slot in slots
            if slot not in booked_slots
        ]

        return Response(available_slots)