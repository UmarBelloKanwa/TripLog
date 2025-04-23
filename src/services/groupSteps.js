export default function groupedSteps(steps) {
  if (!steps || steps.length === 0) return [];
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    if (minutes === 0) return `${seconds} seconds`;
    return seconds === 0
      ? `${minutes} minute${minutes > 1 ? "s" : ""}`
      : `${minutes} min ${seconds} sec`;
  };

  const turnTypeMap = [
    "Turn left",
    "Turn right",
    "Keep left",
    "Keep right",
    "Turn sharp left",
    "Turn sharp right",
    "Make a U-turn",
    "Enter the roundabout",
    "Leave the roundabout",
    "Continue straight",
    "Slight left",
    "Head in direction",
    "Enter ferry",
    "Exit ferry",
    "Merge",
    "Take the on-ramp",
    "Take the off-ramp",
    "End of road",
    "Start at",
    "Reached via point",
    "Use public transport",
    "Leave public transport",
    "Change public transport",
    "Wait",
  ];

  // Set a maximum duration for each group (e.g., 30 minutes)
  const maxGroupDuration = 20 * 60; // 30 minutes in seconds

  const groupedSteps = [];
  let currentGroup = [];
  let currentGroupDuration = 0;

  steps.forEach((step) => {
    const stepDuration = step.duration;

    // If adding this step exceeds the group duration threshold, finalize the current group
    if (currentGroupDuration + stepDuration > maxGroupDuration) {
      // Calculate the total duration for the current group
      const totalDuration = currentGroup.reduce(
        (acc, step) => acc + step.duration,
        0
      );
      const totalDurationText = formatDuration(totalDuration);

      // Get the starting and ending locations
      const startLocation = currentGroup[0].name;
      const endLocation = currentGroup[currentGroup.length - 1].name;

      // Construct the label with start and end locations and total duration
      const label = `${startLocation} to ${endLocation}: ${totalDurationText}`;

      // Combine the description of all steps in this group
      const description = currentGroup
        .map((step) => {
          const distance = step.distance.toFixed(1);
          const durationText = formatDuration(step.duration);
          const turnType = turnTypeMap[step.type] || "Proceed";
          return `${turnType} onto ${step.name}, follow for ${distance} meters. Estimated time: ${durationText}.`;
        })
        .join(" ");

      groupedSteps.push({ label, description });

      // Start a new group with the current step
      currentGroup = [step];
      currentGroupDuration = stepDuration;
    } else {
      // Add the step to the current group
      currentGroup.push(step);
      currentGroupDuration += stepDuration;
    }
  });

  // Add the final group if any remaining steps are left
  if (currentGroup.length > 0) {
    const totalDuration = currentGroup.reduce(
      (acc, step) => acc + step.duration,
      0
    );
    const totalDurationText = formatDuration(totalDuration);

    const startLocation = currentGroup[0].name;
    const endLocation = currentGroup[currentGroup.length - 1].name;

    const label = `${startLocation} to ${endLocation}: ${totalDurationText}`;

    const description = currentGroup
      .map((step) => {
        const distance = step.distance.toFixed(1);
        const durationText = formatDuration(step.duration);
        const turnType = turnTypeMap[step.type] || "Proceed";
        return `${turnType} onto ${step.name}, follow for ${distance} meters. Estimated time: ${durationText}.`;
      })
      .join(" ");

    groupedSteps.push({ label, description });
  }

  return groupedSteps;
}
