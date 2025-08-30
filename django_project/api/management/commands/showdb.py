from django.core.management.base import BaseCommand
from django.db import connection
import os

class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write("DBURL:"+str(os.getenv('DATABASE_URL')))
        self.stdout.write(str(connection.settings_dict))