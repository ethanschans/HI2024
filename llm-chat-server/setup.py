from setuptools import setup

with open("requirements.txt") as f:
    required = f.read().splitlines()

setup(
   name='codechat',
   version='1.0',
   description='Server for Code-Chat.',
   author='Eunice Chan',
   author_email='ecchan2@illinois.edu',
   packages=['codechat'],
    install_required=required,
)