const form = document.getElementById("registerForm")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const user = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    const response = await fetch("/api/sessions/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    const data = await response.json()

    if (data.status === "success") {
        alert("Usuario creado")
        window.location.href = "/login"
    } else {
        alert("Error")
    }
})
