from django.db import models
 



class Education(models.Model):
    education_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    education_type = models.CharField(max_length=19)
    school_college_name = models.CharField(max_length=200)
    board_university = models.CharField(max_length=200, blank=True, null=True)
    year_of_passing = models.TextField(blank=True, null=True)  # This field type is a guess.
    percentage_cgpa = models.CharField(max_length=50, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'education'



class PersonalDetails(models.Model):
    personal_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=150)
    email = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    professional_summary = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personal_details'


class ResumeMaster(models.Model):
    resume_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(blank=True, null=True)
    resume_title = models.CharField(max_length=200, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resume_master'



class Skills(models.Model):
    skill_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    skill_name = models.CharField(max_length=150)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'skills'


class WorkExperience(models.Model):
    experience_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    job_title = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200)
    start_date = models.CharField(max_length=50, blank=True, null=True)
    end_date = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'work_experience'




