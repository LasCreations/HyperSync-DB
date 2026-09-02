export const postNewParticipant = async (data, reg, courseId, instructorId) => {
    // Construct the payload directly as an object
    // const formData = {
    //     course_id: courseId,
    //     instructor_id: instructorId,
    //     participant_id: data.id,
    //     registration_date: reg["Date"],
    // };

    const formData = {
        first_name: reg["First Name"],
        last_name: reg["Last Name"],
        telephone: reg["Telephone"],
        email: reg["Email"],
        occupation: reg["Occupation"],
        workplace: reg["Place of Work"],
        course_id: courseId,
        instructor_id: instructorId
    };

    try {
        console.log("STEP 1 - formData:", formData);
        // 1. Add Participant
        const participantRaw = await fetch("http://192.168.0.67:8080/participants/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const participantText = await participantRaw.text();
        console.log("Participant raw response:", participantText);

        if (!participantRaw.ok) throw new Error(`Failed to add participant: ${participantText}`);

        const participantData = JSON.parse(participantText);

        if (!participantData.id) throw new Error("Participant was created but no 'id' was returned. Check backend response.");


        // 2. Add Registration
        const registrationPayload = {
            course_id: Number(formData.course_id),
            instructor_id: Number(formData.instructor_id),
            participant_id: participantData.id,
            registration_date: reg["Date"],
        };

        console.log("STEP 2 - registrationPayload:", registrationPayload);

        const registrationRaw = await fetch("http://192.168.0.67:8080/registrations/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registrationPayload)
        });

        const registrationText = await registrationRaw.text();
        console.log(registrationRaw.status);
        console.log(registrationText);

        if (!registrationRaw.ok) throw new Error(`Failed to add registration: ${registrationText}`);

        const registrationData = JSON.parse(registrationText);
        console.log("STEP 2 - registrationData.id:", registrationData.id);

        if (!registrationData.id) throw new Error("Registration was created but no 'id' was returned. Check backend response.");

        // 3. Add Certification
        const certPayload = {
            registration_id: registrationData.id,
            participant_id: participantData.id,
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

        // const registrationResponse = await fetch("http://192.168.0.67:8080/registrations/add", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(formData)
        // });

        // if (!registrationResponse.ok) throw new Error("Failed to add registration.");

        // const registrationData = await registrationResponse.json();
        // console.log("Registration added successfully:", registrationData);

        // const certPayload = {
        //     registration_id: registrationData.id,
        //     participant_id: data.id,
        //     issue_date: reg["Date"]
        // };
        // console.log("STEP 3 - certPayload:", certPayload);

        // const certificationRaw = await fetch("http://192.168.0.67:8080/certification/add", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(certPayload)
        // });

        // const certificationText = await certificationRaw.text();
        // console.log(certificationRaw.status);
        // console.log(certificationText);

        // if (!certificationRaw.ok) throw new Error(`Failed to add certification: ${certificationText}`);

        // console.log("All steps succeeded.");
        // return true;

    } catch (err) {
        console.error("Error during submission:", err);
        return false;
    }
};