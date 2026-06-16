"""
URL configuration for Smart_HMS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Management.views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'doctor-schedule',
    DoctorScheduleViewSet,
    basename='doctor-schedule'
)

urlpatterns = [
    path('admin/', admin.site.urls),

     path('login/', RoleBasedLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', MyProfileView.as_view()),
    path('profile/edit/', EditProfileView.as_view()),
    
    path('patient/',PatientCreateView.as_view(),name='patient'),
    path('patient/<int:id>/',PatientCreateView.as_view(),name='patient-reg'),

    path('department/',DepartmentCreateView.as_view(),name='department'),
    path('department/<int:id>/',DepartmentCreateView.as_view(),name='department-update'),

    path('doctor/',DoctorCreateView.as_view(),name='doctor'),
    path('doctor/<int:id>/',DoctorCreateView.as_view(),name='doctor-update'),

    path('doctors/', DoctorListView.as_view()),
    path('doctor-detail/<int:id>/', DoctorDetailView.as_view()),

    path('appointments/create/',AppointmentCreateView.as_view()),
    path('patient/active-consultations/',ActiveConsultationView.as_view()),

    path('patient/prescriptions/',MyPrescriptionsView.as_view()),
    path('patient/lab-tests/',MyLabTestsView.as_view()),

    path('appointments/',AppointmentListView.as_view()),

    path('appointments/my/',MyAppointmentsView.as_view()),

    path('appointments/doctor/',DoctorAppointmentsView.as_view()),

    path('slots/<int:doctor_id>/<str:date>/',AvailableSlotsView.as_view()),

]
urlpatterns += router.urls
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )