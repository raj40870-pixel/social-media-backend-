import axios from 'axios';

async function test() {
    try {
        // 1. Login as Narendra
        const loginRes = await axios.post('http://localhost:3456/api/auth/login', {
            email: 'pm@gmail.com',
            password: 'Narendra' // password from Login.jsx
        });
        const cookie = loginRes.headers['set-cookie'][0];
        console.log("Logged in:", loginRes.data.user.email);
        console.log("Cookie:", cookie);

        // 2. Check Prince
        const checkRes = await axios.get('http://localhost:3456/api/users/check?email=prince@gmail.com', {
            headers: { Cookie: cookie }
        });
        console.log("Check user:", checkRes.data.data);

        // 3. Send request
        try {
            const sendRes = await axios.post('http://localhost:3456/api/connections/send-request', {
                toUserId: checkRes.data.data._id
            }, {
                headers: { Cookie: cookie }
            });
            console.log("Send request success:", sendRes.data);
        } catch (e) {
            console.error("Send request error:", e.response ? e.response.data : e.message);
        }
    } catch (e) {
        console.error("Test error:", e.response ? e.response.data : e.message);
    }
}
test();
