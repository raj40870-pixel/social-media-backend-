const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log("🚀 Testing Signup...");
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: "Narendra",
            lastName: "Modi",
            email: "narendra_" + Math.floor(Math.random() * 10000) + "@example.com",
            password: "Password123"
        })
    });
    
    const signupData = await signupRes.json();
    console.log("Signup Response:", signupData);

    if (!signupRes.ok) {
        console.log("Stopping tests due to signup failure.");
        return;
    }

    const email = signupData.user.email;

    console.log("\n🔑 Testing Login...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: "Password123"
        })
    });

    const loginData = await loginRes.json();
    console.log("Login Response:", loginData);

    // Extract cookie for authenticated requests
    const cookieHeader = loginRes.headers.get('set-cookie');
    const token = cookieHeader ? cookieHeader.split(';')[0] : '';
    console.log("Session Cookie Captured:", token ? "Yes" : "No");

    console.log("\n👤 Testing Edit Profile...");
    const editRes = await fetch(`${BASE_URL}/profile/edit`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Cookie': token
        },
        body: JSON.stringify({
            photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",
            age: 73,
            gender: "Male",
            about: "Prime Minister of India",
            skills: ["Leadership", "Politics"]
        })
    });
    
    const editData = await editRes.json();
    console.log("Edit Profile Response:", editData);

    console.log("\n✅ All Tests Completed Successfully!");
}

testAPI().catch(err => {
    console.error("Test Error (Is the server running?):", err.message);
});
