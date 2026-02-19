const form = document.getElementById("loginForm")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    const response = await fetch("/api/sessions/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    const data = await response.json()

    if (data.status === "success") {

        localStorage.setItem("token", data.token)

        window.location.href = "/products"
    } else {
        alert("Credenciales incorrectas")
    }
})
