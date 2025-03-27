function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: ''
  });

    const { setUserData, setToken, setRegistrationError } = useContext(AppContext);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post('/register', formData);

            // If auto-login after registration
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUserData(data.user);
        } catch (error) {
            setRegistrationError(error.response.data.message);
        }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
        />

        <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            pattern="[0-9]{10}"
            required
        />

        <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            min="18"
            max="100"
            required
        />

        <button type="submit">Register</button>
      </form>
  );
}
