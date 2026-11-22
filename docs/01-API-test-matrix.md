| Scenario | Expected status | Expected UI | Actual result | Passed |
| --- | --- | --- | --- | --- |
| Success | 200/2xx | Data is displayed | Like expected | Yes |
| Not Found | 404 | Something went wrong. We can't find any events right now. (Något gick fel. Vi kan inte hitta några events just nu.) | Like expected | Yes |
| Server error | 500/5xx | Try again later (Oops... Något gick fel, försök igen senare!) | Like expected | Yes |
| Network error | No status | Service unreachable (Servern kunde tyvärr inte nås just nu.) | Like expected | Yes |
