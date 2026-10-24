"""
Migration 0002: Add new tables and columns for Projects, Certifications,
Achievements, Strengths, Languages, AdditionalDetails, and extend
personal_details with location / linkedin_url / github_url.

All Django models are managed=False (the DB owns the schema).
This migration uses RunSQL so the physical tables are created in MySQL.
"""

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resume_ai', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            -- Extend personal_details with new columns (safe: only adds if not already present)
            ALTER TABLE personal_details
                ADD COLUMN IF NOT EXISTS location VARCHAR(200) NULL,
                ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(300) NULL,
                ADD COLUMN IF NOT EXISTS github_url VARCHAR(300) NULL;

            -- project
            CREATE TABLE IF NOT EXISTS project (
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
                    REFERENCES personal_details (personal_id)
                    ON DELETE CASCADE
            );

            -- certification
            CREATE TABLE IF NOT EXISTS certification (
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
                    REFERENCES personal_details (personal_id)
                    ON DELETE CASCADE
            );

            -- achievement
            CREATE TABLE IF NOT EXISTS achievement (
                achievement_id INT AUTO_INCREMENT PRIMARY KEY,
                personal_id    INT NOT NULL,
                description    TEXT NOT NULL,
                created_on     DATETIME NULL,
                created_by     VARCHAR(100) NULL,
                updated_on     DATETIME NULL,
                updated_by     VARCHAR(100) NULL,
                CONSTRAINT fk_achieve_personal FOREIGN KEY (personal_id)
                    REFERENCES personal_details (personal_id)
                    ON DELETE CASCADE
            );

            -- strength
            CREATE TABLE IF NOT EXISTS strength (
                strength_id   INT AUTO_INCREMENT PRIMARY KEY,
                personal_id   INT NOT NULL,
                strength_name VARCHAR(150) NOT NULL,
                created_on    DATETIME NULL,
                created_by    VARCHAR(100) NULL,
                updated_on    DATETIME NULL,
                updated_by    VARCHAR(100) NULL,
                CONSTRAINT fk_strength_personal FOREIGN KEY (personal_id)
                    REFERENCES personal_details (personal_id)
                    ON DELETE CASCADE
            );

            -- language
            CREATE TABLE IF NOT EXISTS `language` (
                language_id   INT AUTO_INCREMENT PRIMARY KEY,
                personal_id   INT NOT NULL,
                language_name VARCHAR(100) NOT NULL,
                proficiency   VARCHAR(100) NULL,
                created_on    DATETIME NULL,
                created_by    VARCHAR(100) NULL,
                updated_on    DATETIME NULL,
                updated_by    VARCHAR(100) NULL,
                CONSTRAINT fk_lang_personal FOREIGN KEY (personal_id)
                    REFERENCES personal_details (personal_id)
                    ON DELETE CASCADE
            );

            -- additional_details
            CREATE TABLE IF NOT EXISTS additional_details (
                additional_id INT AUTO_INCREMENT PRIMARY KEY,
                personal_id   INT NOT NULL UNIQUE,
                availability  VARCHAR(100) NULL,
                created_on    DATETIME NULL,
                created_by    VARCHAR(100) NULL,
                updated_on    DATETIME NULL,
                updated_by    VARCHAR(100) NULL,
                CONSTRAINT fk_additional_personal FOREIGN KEY (personal_id)
                    REFERENCES personal_details (personal_id)
                    ON DELETE CASCADE
            );
            """,
            reverse_sql="""
            DROP TABLE IF EXISTS additional_details;
            DROP TABLE IF EXISTS `language`;
            DROP TABLE IF EXISTS strength;
            DROP TABLE IF EXISTS achievement;
            DROP TABLE IF EXISTS certification;
            DROP TABLE IF EXISTS project;
            ALTER TABLE personal_details
                DROP COLUMN IF EXISTS location,
                DROP COLUMN IF EXISTS linkedin_url,
                DROP COLUMN IF EXISTS github_url;
            """,
        ),
    ]
