from django.contrib import admin
from django.urls import include, path

# url根目录规则
urlpatterns = [
	path('', include('nmapreport.urls')),
	path('report/', include('nmapreport.urls')),
	path('admin/', admin.site.urls),
]
