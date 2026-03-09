# Voice Command Guide

The voice control system allows you to navigate and control the application hands-free. Just click the **Voice** button in the sidebar and speak any of the commands below.

## Navigation Commands

| Command                      | What it does                      |
| ---------------------------- | --------------------------------- |
| `show jobs` or `jobs`        | Navigate to the jobs listing page |
| `go to jobs`                 | Navigate to the jobs listing page |
| `dashboard` or `home`        | Go back to your main dashboard    |
| `go to dashboard`            | Go to your dashboard              |
| `resumes` or `my resumes`    | View your resume collection       |
| `matcher` or `job matcher`   | Open the job matcher tool         |
| `company dashboard`          | Go to company dashboard           |
| `post job`                   | Open the job posting form         |
| `manage jobs`                | View and manage posted jobs       |
| `admin` or `admin dashboard` | Open admin dashboard              |
| `manage users`               | Go to user management page        |
| `manage companies`           | Go to company management page     |

## Action Commands

| Command                | What it does             |
| ---------------------- | ------------------------ |
| `apply` or `apply job` | Apply to the current job |
| `submit`               | Submit the current form  |
| `save`                 | Save your changes        |
| `cancel`               | Cancel current action    |
| `delete`               | Delete an item           |
| `edit`                 | Edit an item             |
| `back`                 | Go back to previous page |

## Account Commands

| Command                | What it does             |
| ---------------------- | ------------------------ |
| `logout` or `sign out` | Sign out of your account |
| `exit`                 | Exit the application     |

## Search Commands

| Command            | What it does                                               |
| ------------------ | ---------------------------------------------------------- |
| `search [keyword]` | Search for jobs with a keyword (e.g., "search javascript") |

## Help Commands

| Command          | What it does                       |
| ---------------- | ---------------------------------- |
| `help`           | Get a list of available commands   |
| `commands`       | Get a list of available commands   |
| `what can i say` | Get suggestions for voice commands |

## Tips for Best Results

1. **Click the Voice Button**: Make sure the "Voice" button in the sidebar is red and shows "Listening..."
2. **Speak Clearly**: Speak at a normal pace and volume
3. **One Command at a Time**: Say one complete command, then wait for the response
4. **Use Available Data Attributes**: Elements marked with `data-apply`, `data-save`, `data-delete` etc. respond to voice commands
5. **Check Your Browser**: Voice recognition works best in Chrome, Edge, and Safari

## Troubleshooting

### Voice not working?

- Check if your browser supports Web Speech API (Chrome, Edge, Safari)
- Ensure microphone is enabled in browser permissions
- Try clicking the Voice button again

### Command not recognized?

- Say "help" to get a list of available commands
- Try a simpler command first
- Speak more clearly

### Can't hear the response?

- Check browser volume settings
- Ensure volume is not muted
- The system will speak the action being performed

## Adding Custom Commands

To add new voice commands, edit the `VOICE_COMMANDS` object in `src/context/VoiceContext.jsx`:

```javascript
const VOICE_COMMANDS = {
  "your command": {
    action: "navigate",
    value: "/path",
    feedback: "What to say when command is recognized",
  },
};
```

Available actions:

- `navigate`: Navigate to a route
- `click`: Click an element with a selector
- `logout`: Sign out user
- `help`: Provide help text
