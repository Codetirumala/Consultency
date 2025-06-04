import React, { useState } from 'react';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', email: '' });

  const addClient = () => {
    setClients([...clients, newClient]);
    setNewClient({ name: '', email: '' });
  };

  const deleteClient = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

  return (
    <div>
      <h2>Client Management</h2>
      <div>
        <input
          type="text"
          placeholder="Client Name"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Client Email"
          value={newClient.email}
          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
        />
        <button onClick={addClient}>Add Client</button>
      </div>
      <ul>
        {clients.map((client, index) => (
          <li key={index}>
            {client.name} - {client.email}
            <button onClick={() => deleteClient(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientManagement; 