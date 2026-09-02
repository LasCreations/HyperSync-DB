export const postExistingParticipant = async (data, reg, courseId, instructorId) => {
    // Construct the payload directly as an object
    const formData = {
        course_id: courseId,
        instructor_id: instructorId,
        participant_id: data.id,
        registration_date: reg["Date"],
    };

    try {
        const registrationResponse = await fetch("http://192.168.0.67:8080/registrations/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (!registrationResponse.ok) throw new Error("Failed to add registration.");

        const registrationData = await registrationResponse.json();
        console.log("Registration added successfully:", registrationData);

        const certPayload = {
            registration_id: registrationData.id,
            participant_id: data.id,
            issue_date: reg["Date"]
        };
        console.log("STEP 3 - certPayload:", certPayload);

        const certificationRaw = await fetch("http://192.168.0.67:8080/certification/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(certPayload)
        });

        const certificationText = await certificationRaw.text();
        console.log(certificationRaw.status);
        console.log(certificationText);

        if (!certificationRaw.ok) throw new Error(`Failed to add certification: ${certificationText}`);

        console.log("All steps succeeded.");
        return true;

    } catch (err) {
        console.error("Error during submission:", err);
        return false;
    }
};