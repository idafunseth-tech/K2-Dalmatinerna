| Scenario | Testing method | Expected UI | Actual result |
| --- | --- | --- | --- |
| Valid response | /api/events | Data is displayed | As expected |
| Empty data | /api/test/empty | Empty displayed | As expected |
| Server error | /api/test/error | Error displayed | As expected |
| Invalid path | Temporarily changed URL | Error displayed | As expected |
| Network error | Stop the API or use DevTools offline | Error displayed | As expected |
