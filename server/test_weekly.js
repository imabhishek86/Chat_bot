const http = require('http');

const callApi = (path, method = 'GET', data = null) => {
    return new Promise((resolve, reject) => {
        const body = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        };

        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => resolve(JSON.parse(resData)));
        });

        req.on('error', (error) => reject(error));
        if (body) req.write(body);
        req.end();
    });
};

async function runTests() {
    try {
        console.log('--- Step 1: Cleaning DB (Conceptual) & Adding Tasks ---');
        // We'll add some tasks via the chat API we already verified, or just assume they are there.
        // For a clean test, let's use the new knowledge and add specific tasks.
        
        await callApi('/api/chat', 'POST', { message: 'Add Task A due tomorrow' });
        await callApi('/api/chat', 'POST', { message: 'Add Task B in 4 days' });
        await callApi('/api/chat', 'POST', { message: 'Add Task C in 10 days' });

        console.log('\n--- Step 2: Testing GET /api/assignments/this-week ---');
        const res = await callApi('/api/assignments/this-week');
        
        console.log('✅ Count:', res.count);
        console.log('✅ Assignments Returned:');
        res.assignments.forEach(a => {
            console.log(`- ${a.title} | Deadline: ${new Date(a.deadline).toDateString()} | Priority: ${a.priority}`);
        });

        // Verification logic
        const inAWeek = res.assignments.every(a => {
            const diff = (new Date(a.deadline) - new Date()) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 7.5; // Slight buffer
        });
        
        console.log('\n--- Verification ---');
        console.log(inAWeek ? '✅ All tasks are within this week' : '❌ Some tasks are outside the week range');
        
        const sorted = res.assignments.every((a, i) => {
            if (i === 0) return true;
            return new Date(a.deadline) >= new Date(res.assignments[i-1].deadline);
        });
        console.log(sorted ? '✅ Tasks are sorted by deadline' : '❌ Tasks are NOT sorted correctly');

    } catch (err) {
        console.error('❌ API Test failed:', err.message);
    }
}

runTests();
