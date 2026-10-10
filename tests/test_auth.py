import json
from types import SimpleNamespace
from unittest.mock import AsyncMock

import bcrypt
import pytest
from fastapi.testclient import TestClient
import main


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv('CAREFLOW_JWT_SECRET', 'fixture-secret-with-at-least-32-characters')
    password_hash = bcrypt.hashpw(b'fixture-password', bcrypt.gensalt(rounds=4)).decode()
    rows = [{'username': name, 'password_hash': password_hash, 'role': role, 'patient_id': patient} for name, role, patient in [('doctor', 'doctor', None), ('nurse', 'nurse', None), ('patient', 'patient', 'bound-patient')]]
    monkeypatch.setenv('CAREFLOW_USERS_JSON', json.dumps(rows))
    return TestClient(main.app)


def headers(client, name):
    response = client.post('/api/auth/login', json={'username': name, 'password': 'fixture-password'})
    assert response.status_code == 200
    return {'Authorization': 'Bearer ' + response.json()['access_token']}


@pytest.mark.parametrize('path', ['/api/patients', '/api/tasks/any'])
def test_read_requires_server_authentication(client, path):
    assert client.get(path).status_code in (401, 403)


def test_bad_password_cannot_select_doctor_role(client):
    assert client.post('/api/auth/login', json={'username': 'doctor', 'password': 'doc123'}).status_code == 401


def test_patient_cannot_read_other_patients_tasks(client):
    assert client.get('/api/tasks/other-patient', headers=headers(client, 'patient')).status_code == 403


def test_patient_cannot_create_patients_or_analyze(client):
    auth = headers(client, 'patient')
    assert client.post('/api/patients', headers=auth, json={'name': 'fixture'}).status_code == 403
    assert client.post('/api/analyze/bound-patient', headers=auth, json={'note': 'fixture'}).status_code == 403


def test_doctor_cannot_toggle_tasks(client):
    assert client.patch('/api/tasks/invalid', headers=headers(client, 'doctor')).status_code == 403


def test_patient_can_read_only_bound_tasks(client, monkeypatch):
    class Cursor:
        def sort(self, *args): return self
        def __aiter__(self): return self
        async def __anext__(self): raise StopAsyncIteration
    seen = []
    collection = SimpleNamespace(find=lambda query: (seen.append(query), Cursor())[1])
    monkeypatch.setattr(main, 'tasks_collection', collection)
    response = client.get('/api/tasks/bound-patient', headers=headers(client, 'patient'))
    assert response.status_code == 200
    assert seen == [{'patient_id': 'bound-patient'}]


def test_login_denies_missing_auth_configuration(client, monkeypatch):
    monkeypatch.setenv('CAREFLOW_JWT_SECRET', '')
    assert client.post('/api/auth/login', json={'username': 'doctor', 'password': 'fixture-password'}).status_code == 503
