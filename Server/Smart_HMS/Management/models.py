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



from django.db.models import Q, UniqueConstraint

class AppointmentModel(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )

    patient = models.ForeignKey(PatientModel, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorModel, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    token_number = models.PositiveIntegerField(null=True, blank=True)
    booked_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='booked_appointments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            # Prevent double booking the exact same token for the same doctor on the same day
            UniqueConstraint(
                fields=['doctor', 'appointment_date', 'token_number'],
                condition=Q(status__in=['pending', 'confirmed']),
                name='unique_active_doctor_token'
            ),
            # Prevent a patient from booking the same doctor multiple times on the same day
            UniqueConstraint(
                fields=['patient', 'doctor', 'appointment_date'],
                condition=Q(status__in=['pending', 'confirmed']),
                name='unique_active_patient_booking'
            )
        ]

    def __str__(self):
        return f"Token {self.token_number} - {self.patient} with {self.doctor} on {self.appointment_date}"
    

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




class StaffModel(models.Model):

    user = models.ForeignKey(UserModel,on_delete=models.CASCADE)

    designation = models.CharField(max_length=100)

    salary = models.DecimalField(max_digits=10,decimal_places=2)
    profile = models.ImageField(upload_to='media/',null=True,blank=True)


class DoctorLeaveModel(models.Model):

    STATUS_CHOICES = (
        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected'),
        ('cancelled','Cancelled')
    )

    LEAVE_TYPE = (
        ('full_day','Full Day'),
        ('half_day','Half Day')
    )

    doctor = models.ForeignKey(DoctorModel,on_delete=models.CASCADE,related_name='leaves')
    from_date = models.DateField()
    to_date = models.DateField()
    leave_type = models.CharField(max_length=20,choices=LEAVE_TYPE,default='full_day')
    reason = models.TextField()
    status = models.CharField( max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(UserModel,null=True,blank=True,on_delete=models.SET_NULL,related_name='approved_leaves')
    remarks = models.TextField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class MedicineCategoryModel(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Medicine Categories"

    def __str__(self):
        return self.name

class MedicineModel(models.Model):
    FORM_CHOICES = (
        ('tablet', 'Tablet'),
        ('capsule', 'Capsule'),
        ('syrup', 'Syrup'),
        ('injection', 'Injection'),
        ('ointment', 'Ointment'),
        ('drops', 'Drops'),
        ('inhaler', 'Inhaler'),
        ('other', 'Other'),
    )

    category = models.ForeignKey(MedicineCategoryModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='medicines')
    name = models.CharField(max_length=150)
    generic_name = models.CharField(max_length=150, null=True, blank=True, help_text="e.g., Paracetamol")
    form = models.CharField(max_length=20, choices=FORM_CHOICES, default='tablet')
    strength = models.CharField(max_length=50, null=True, blank=True, help_text="e.g., 500mg, 5ml")
    manufacturer = models.CharField(max_length=100, null=True, blank=True)
    
    # Inventory Tracking
    stock = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=10, help_text="Triggers low-stock warning")
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Selling price per unit")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.strength})" if self.strength else self.name

    @property
    def is_low_stock(self):
        return self.stock <= self.reorder_level


# ------------------------------------------------------------------
# 3. BATCH & EXPIRY MANAGEMENT MODEL
# ------------------------------------------------------------------
class MedicineBatchModel(models.Model):
    """
    Tracks specific batches received from suppliers, critical for 
    handling expiry dates and lot numbers.
    """
    medicine = models.ForeignKey(MedicineModel, on_delete=models.CASCADE, related_name='batches')
    batch_number = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('medicine', 'batch_number')

    def __str__(self):
        return f"{self.medicine.name} - Batch #{self.batch_number} (Exp: {self.expiry_date})"

    @property
    def is_expired(self):
        return self.expiry_date <= timezone.now().date()


# ------------------------------------------------------------------
# 4. REFACTORED PRESCRIPTION MODELS (Parent-Child Setup)
# ------------------------------------------------------------------
class PrescriptionModel(models.Model):
    patient = models.ForeignKey('PatientModel', on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey('DoctorModel', on_delete=models.CASCADE, related_name='prescriptions')
    appointment = models.ForeignKey('AppointmentModel', on_delete=models.SET_NULL, null=True, blank=True, related_name='prescriptions')
    notes = models.TextField(null=True, blank=True, help_text="Doctor's general advice or dietary warnings")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription #{self.id} for {self.patient}"


class PrescriptionItemModel(models.Model):
    """
    Individual medicine items attached to a single prescription.
    """
    prescription = models.ForeignKey(PrescriptionModel, on_delete=models.CASCADE, related_name='items')
    medicine = models.ForeignKey(MedicineModel, on_delete=models.PROTECT)
    dosage = models.CharField(max_length=50, help_text="e.g., 1-0-1 or 1 tablet every 8 hours")
    duration = models.CharField(max_length=50, help_text="e.g., 5 days")
    instructions = models.CharField(max_length=150, null=True, blank=True, help_text="e.g., After food")
    quantity_prescribed = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.medicine.name} for {self.prescription.patient}"