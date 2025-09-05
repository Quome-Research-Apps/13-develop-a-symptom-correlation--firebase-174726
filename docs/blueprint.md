# **App Name**: Symptom Insights

## Core Features:

- CSV Data Import: Enable the user to import two CSV files: one for symptom data and another for environmental factors.
- Time Series Alignment: Align the imported time-series data from both CSV files based on timestamps.
- Correlation Analysis: Perform statistical correlation analysis to identify relationships between symptoms and environmental factors. A LLM can act as a tool and decide which kind of tests, thresholds or metrics to apply based on the type of symptom/factor it is analyzing. Also provides insights as to any biases of these methodologies and what compensating steps may need to be taken.
- Visual Correlation Matrix: Generate a correlation matrix visualizing the strength and direction of correlations between each symptom and environmental factor.
- Interactive Data Charts: Create interactive time-series charts allowing users to zoom, pan, and inspect specific data points for both symptoms and environmental factors.
- Descriptive Statistics Display: Display descriptive statistics (mean, median, standard deviation) for each symptom and environmental factor to provide context for the correlation analysis.
- Export Report: Allow the user to export a report that is in the form of static JSON and contains the correlation matrix, charts, statistics, settings and a list of sources and attributions

## Style Guidelines:

- Primary color: Teal (#008080) evokes a sense of calmness, analysis, and health.
- Background color: Very light grayish-teal (#F0FFFF) for a clean and analytical environment.
- Accent color: Yellow-Gold (#FFD700) to highlight key insights and correlations.
- Font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Use minimalist, line-based icons to represent different symptoms and environmental factors.
- A clean and intuitive dashboard layout, prioritizing data visualization and easy navigation between correlation results, charts, and statistics.
- Subtle transitions and animations to enhance user interaction with charts and data exploration, without being distracting.