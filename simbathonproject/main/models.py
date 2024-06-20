from django.db import models

# Create your models here.
class Varsity(models.Model):
    college=models.CharField(max_length=20, null=True)
    major=models.CharField(max_length=20)
    like_count=models.PositiveIntegerField(default=0)
    image_front=models.ImageField(upload_to='varsity/', null=True)
    image_back=models.ImageField(upload_to='varsity/', null=True)

class Keyword(models.Model):
    keyword=models.CharField(max_length=20, null=True)
    varsity_id=models.ForeignKey(Varsity, on_delete=models.CASCADE, related_name='keywords')