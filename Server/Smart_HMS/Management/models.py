from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class UserModel(AbstractUser):

    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('staff', 'Staff'),
        ('pharmacist', 'Pharmacist'),
        ('lab', 'Lab'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES,null=True,blank=True)
    phone = models.PositiveBigIntegerField(null=True,blank=True)
    address = models.TextField(null=True,blank=True)
    photo = models.ImageField(null=True,blank=True,upload_to='profile/')


class PatientModel(models.Model):

    gender_choice = (('Male','Male'),('Female','Female'),('Others','Others'))

    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    gender = models.CharField(choices=gender_choice,null=True,blank=True,max_length=20)
    DOB = models.DateField(null=True,blank=True)
    blood_group = models.CharField(max_length=50,null=True,blank=True)
    patient_code = models.CharField(max_length=50,null=True,blank=True)
    age = models.PositiveIntegerField(null=True,blank=True)
    weight = models.PositiveIntegerField(null=True,blank=True)
    height = models.PositiveIntegerField(null=True,blank=True)

class DepartmentModel(models.Model):

    dep_name = models.CharField(max_length=50,null=True,blank=True)
    des = models.CharField(max_length=100,null=True,blank=True)

    def __str__(self):
        return self.dep_name if self.dep_name else f"Department {self.id}"

class DoctorModel(models.Model):

    department = models.ForeignKey(DepartmentModel,on_delete=models.CASCADE)
    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    specialization = models.CharField(max_length=50,null=True,blank=True)
    qualification = models.CharField(max_length=100,null=True,blank=True)
    con_fee = models.PositiveIntegerField(null=True,blank=True)



class AppointmentModel(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )

    patient = models.ForeignKey(PatientModel,on_delete=models.CASCADE,related_name='appointments')
    doctor = models.ForeignKey(DoctorModel,on_delete=models.CASCADE,related_name='appointments')
    appointment_date = models.DateField()
    token_number = models.PositiveIntegerField(null=True,blank=True)
    booked_by = models.ForeignKey(UserModel,on_delete=models.SET_NULL,null=True,blank=True,related_name='booked_appointments')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')
    reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

class DoctorScheduleModel(models.Model):

    DAY_CHOICES = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    )

    doctor = models.ForeignKey(DoctorModel,on_delete=models.CASCADE)
    day = models.CharField(max_length=20, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.PositiveIntegerField(default=10, help_text="Minutes")


class MedicalRecordModel(models.Model):
    patient = models.ForeignKey(PatientModel,on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorModel,on_delete=models.CASCADE)

    symptoms = models.TextField()
    diagnosis = models.TextField()
    prescription = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

class PrescriptionModel(models.Model):
    patient = models.ForeignKey(PatientModel,on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorModel,on_delete=models.CASCADE)

    medicine_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

class MedicineModel(models.Model):

    name = models.CharField(max_length=100)

    stock = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

class LabTestModel(models.Model):

    patient = models.ForeignKey(
        PatientModel,
        on_delete=models.CASCADE
    )

    test_name = models.CharField(max_length=100)

    result = models.TextField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        default='pending'
    )

class DoctorLeaveModel(models.Model):

    doctor = models.ForeignKey(
        DoctorModel,
        on_delete=models.CASCADE
    )

    leave_date = models.DateField()

    reason = models.CharField(max_length=200)


class StaffModel(models.Model):

    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE
    )

    designation = models.CharField(max_length=100)

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )