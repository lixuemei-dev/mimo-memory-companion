# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: lixuemei-dev@users.noreply.github.com
3. Include: description, steps to reproduce, potential impact
4. We will respond within 48 hours

## Security Measures

- No user data stored externally
- Local-only memory processing
- No external API calls without explicit configuration
- Token data encrypted at rest (optional)

## Best Practices

- Keep your API keys in `.env` (never commit)
- Use environment variables for sensitive config
- Regularly update dependencies
