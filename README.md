# Triplog

Triplog is a comprehensive trip tracking and logging solution designed for professional truck drivers and logistics teams. It simplifies the process of planning, tracking, and logging trips, ensuring compliance with travel regulations.

## Features

- **Trip Planning**: Enter trip details, including pickup and drop-off locations, and get optimized routes with rest stops and fuel points.
- **Real-Time Tracking**: Update your journey with actual stops, rest periods, and fuel stops.
- **Daily Log Sheets**: Automatically generate and update log sheets for compliance.
- **Trip Management**: Save, review, and manage your trips with ease.
- **Dark Mode Support**: Seamless light and dark mode themes for better user experience.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Triplog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Running the Backend Locally

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:

   ```bash
   python manage.py runserver
   ```

5. Open your browser and navigate to `http://127.0.0.1:8000` to access the backend.

## Technologies Used

- **Frontend**: React, Material-UI, React Router
- **Backend**: Django REST Framework, OpenRouteService Python Library
- **Database**: Dexie.js (IndexedDB)
- **Mapping**: Leaflet.js

## Folder Structure

- `src/components`: Reusable React components.
- `src/pages`: Page-level components.
- `src/layouts`: Layout components for the application.
- `src/hooks`: Custom React hooks.
- `src/models`: Database models and utilities.
- `src/services`: API and utility services.

## Backend and API Folder Structure

- `backend/`

  - `__init__.py`: Initialization file for the backend module.
  - `asgi.py`: ASGI configuration for the Django project.
  - `settings.py`: Django project settings.
  - `urls.py`: URL routing for the backend.
  - `views.py`: Views for handling HTTP requests.
  - `wsgi.py`: WSGI configuration for the Django project.

- `api/`
  - `__init__.py`: Initialization file for the API module.
  - `admin.py`: Admin interface configuration.
  - `apps.py`: Application configuration.
  - `models.py`: Database models.
  - `serializers.py`: Serializers for converting data between JSON and Python objects.
  - `services.py`: Business logic and helper functions.
  - `tests.py`: Unit tests for the API.
  - `urls.py`: URL routing for the API endpoints.
  - `views.py`: Views for handling API requests.
  - `migrations/`: Database migration files.

## Visualization of ELD Log Creation

The application includes a visualization feature for creating ELD (Electronic Logging Device) logs using the HTML `<canvas>` element and vanilla JavaScript. This feature allows users to view and interact with their daily logs in a graphical format.

### Key Features

- **Grid Representation**: Displays a 24-hour grid divided into 15-minute intervals.
- **Status Lines**: Visualizes driver statuses (OFF, SB, D, ON) throughout the day.
- **Dynamic Updates**: Automatically adjusts to different screen sizes and themes.
- **Downloadable Logs**: Users can download the log visualization as a PNG image.

### Example Code

The visualization is implemented in the `LogDayCanvas` component. Below is a simplified example of how the grid and status lines are drawn:

```javascript
const drawGrid = (ctx, width, height) => {
  const hourWidth = width / 24;
  const rowHeight = height / 4;

  ctx.strokeStyle = "#ccc";
  for (let i = 0; i <= 24; i++) {
    ctx.beginPath();
    ctx.moveTo(i * hourWidth, 0);
    ctx.lineTo(i * hourWidth, height);
    ctx.stroke();
  }

  for (let i = 0; i <= 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * rowHeight);
    ctx.lineTo(width, i * rowHeight);
    ctx.stroke();
  }
};

const drawStatusLines = (ctx, entries) => {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;

  entries.forEach(({ startHour, endHour, status }) => {
    const y = status * rowHeight;
    ctx.beginPath();
    ctx.moveTo(startHour * hourWidth, y);
    ctx.lineTo(endHour * hourWidth, y);
    ctx.stroke();
  });
};
```

For more details, refer to the `LogDayCanvas.jsx` file in the `src/components` directory.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or support, please contact [umarbellokanwa@gmail.com](mailto:support@triplog.com).
