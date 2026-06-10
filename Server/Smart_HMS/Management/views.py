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