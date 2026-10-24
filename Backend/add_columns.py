"""
Run this script once to add new columns to personal_details.
The new tables were already created in the previous run.
Usage: python add_columns.py
"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'resumebackend.settings')

from django.db.backends.base import base as dj_base
dj_base.BaseDatabaseWrapper.check_database_version_supported = lambda self: None

import django
django.setup()

from django.db import connection

db_name = 'resume_builder_db'

columns_to_add = [
    ('location', 'VARCHAR(200) NULL'),
    ('linkedin_url', 'VARCHAR(300) NULL'),
    ('github_url', 'VARCHAR(300) NULL'),
]

with connection.cursor() as cursor:
    for col_name, col_def in columns_to_add:
        # Check if column already exists
        cursor.execute(
            "SELECT COUNT(*) FROM information_schema.COLUMNS "
            "WHERE TABLE_SCHEMA = %s AND TABLE_NAME = 'personal_details' AND COLUMN_NAME = %s",
            [db_name, col_name]
        )
        count = cursor.fetchone()[0]
        if count == 0:
            sql = f"ALTER TABLE personal_details ADD COLUMN {col_name} {col_def}"
            cursor.execute(sql)
            print(f"  ADDED  : {col_name}")
        else:
            print(f"  EXISTS : {col_name} (skipped)")

print("\nColumn setup complete!")
