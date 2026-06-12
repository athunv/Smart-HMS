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

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.PositiveBigIntegerField(null=True,blank=True)
    address = models.TextField(null=True,blank=True)
    photo = models.ImageField(null=True,blank=True,upload_to='profile/')


class PatientModel(models.Model):

    gender_choice = (('Male','Male'),('Female','Female'),('Others','Others'))

    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)
    gender = models.CharField(choices=gender_choice,null=True,blank=True)
    DOB = models.DateField(null=True,blank=True)
    blood_group = models.CharField(max_length=50,null=True,blank=True)
    patient_code = models.CharField(max_length=50,null=True,blank=True)

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


from django.db import models

class AppointmentModel(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )

    patient = models.ForeignKey(PatientModel,on_delete=models.CASCADE,related_name='appointments')
    doctor = models.ForeignKey(DoctorModel,on_delete=models.CASCADE,related_name='appointments' )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    booked_by = models.ForeignKey(UserModel,on_delete=models.SET_NULL,null=True,blank=True,related_name='booked_appointments')
    status = models.CharField( max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('doctor', 'appointment_date', 'appointment_time')

    def __str__(self):
        return f"{self.patient.user.username} - {self.doctor.user.username}"
    

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