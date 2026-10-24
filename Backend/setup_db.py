"""
Run this script once to create the new database tables.
Usage: python setup_db.py
"""
import sys
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'resumebackend.settings')

# Bypass the MySQL version check that blocks Django 6 on MySQL 8.0.x
from django.db.backends.base import base as dj_base
dj_base.BaseDatabaseWrapper.check_database_version_supported = lambda self: None

import django
django.setup()

from django.db import connection

sql_statements = [
    # location column
    """ALTER TABLE personal_details ADD COLUMN location VARCHAR(200) NULL""",
    # linkedin_url column
    """ALTER TABLE personal_details ADD COLUMN linkedin_url VARCHAR(300) NULL""",
    # github_url column
    """ALTER TABLE personal_details ADD COLUMN github_url VARCHAR(300) NULL""",

    """CREATE TABLE IF NOT EXISTS project (
        project_id   INT AUTO_INCREMENT PRIMARY KEY,
        personal_id  INT NOT NULL,
        project_name VARCHAR(200) NOT NULL,
        tech_stack   VARCHAR(500) NULL,
        description  TEXT NULL,
        project_url  VARCHAR(500) NULL,
        github_url   VARCHAR(500) NULL,
        created_on   DATETIME NULL,
        created_by   VARCHAR(100) NULL,
        updated_on   DATETIME NULL,
        updated_by   VARCHAR(100) NULL,
        CONSTRAINT fk_project_personal FOREIGN KEY (personal_id)
            REFERENCES personal_details (personal_id) ON DELETE CASCADE
    )""",
    """CREATE TABLE IF NOT EXISTS certification (
        certification_id    INT AUTO_INCREMENT PRIMARY KEY,
        personal_id         INT NOT NULL,
        certification_name  VARCHAR(300) NOT NULL,
        issuing_organization VARCHAR(300) NULL,
        issue_date          VARCHAR(50) NULL,
        credential_url      VARCHAR(500) NULL,
        created_on          DATETIME NULL,
        created_by          VARCHAR(100) NULL,
        updated_on          DATETIME NULL,
        updated_by          VARCHAR(100) NULL,
        CONSTRAINT fk_cert_personal FOREIGN KEY (personal_id)
            REFERENCES personal_details (personal_id) ON DELETE CASCADE
    )""",
    """CREATE TABLE IF NOT EXISTS achievement (
        achievement_id INT AUTO_INCREMENT PRIMARY KEY,
        personal_id    INT NOT NULL,
        description    TEXT NOT NULL,
        created_on     DATETIME NULL,
        created_by     VARCHAR(100) NULL,
        updated_on     DATETIME NULL,
        updated_by     VARCHAR(100) NULL,
        CONSTRAINT fk_achieve_personal FOREIGN KEY (personal_id)
            REFERENCES personal_details (personal_id) ON DELETE CASCADE
    )""",
    """CREATE TABLE IF NOT EXISTS strength (
        strength_id   INT AUTO_INCREMENT PRIMARY KEY,
        personal_id   INT NOT NULL,
        strength_name VARCHAR(150) NOT NULL,
        created_on    DATETIME NULL,
        created_by    VARCHAR(100) NULL,
        updated_on    DATETIME NULL,
        updated_by    VARCHAR(100) NULL,
        CONSTRAINT fk_strength_personal FOREIGN KEY (personal_id)
            REFERENCES personal_details (personal_id) ON DELETE CASCADE
    )""",
    """CREATE TABLE IF NOT EXISTS `language` (
        language_id   INT AUTO_INCREMENT PRIMARY KEY,
        personal_id   INT NOT NULL,
        language_name VARCHAR(100) NOT NULL,
        proficiency   VARCHAR(100) NULL,
        created_on    DATETIME NULL,
        created_by    VARCHAR(100) NULL,
        updated_on    DATETIME NULL,
        updated_by    VARCHAR(100) NULL,
        CONSTRAINT fk_lang_personal FOREIGN KEY (personal_id)
            REFERENCES personal_details (personal_id) ON DELETE CASCADE
    )""",
    """CREATE TABLE IF NOT EXISTS additional_details (
        additional_id INT AUTO_INCREMENT PRIMARY KEY,
        personal_id   INT NOT NULL UNIQUE,
        availability  VARCHAR(100) NULL,
        created_on    DATETIME NULL,
        created_by    VARCHAR(100) NULL,
        updated_on    DATETIME NULL,
        updated_by    VARCHAR(100) NULL,
        CONSTRAINT fk_additional_personal FOREIGN KEY (personal_id)
            REFERENCES personal_details (personal_id) ON DELETE CASCADE
    )""",
]

errors = []
with connection.cursor() as cursor:
    for sql in sql_statements:
        short = sql.strip()[:70].replace('\n', ' ')
        try:
            cursor.execute(sql)
            print(f"  OK : {short}...")
        except Exception as e:
            print(f"  ERR: {short}... => {e}")
            errors.append(str(e))

if errors:
    print("\nSome statements failed. See above.")
    sys.exit(1)
else:
    print("\nAll tables/columns created successfully!")
