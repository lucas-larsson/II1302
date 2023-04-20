const { sendQuery } = require('../../utils/dbIntegration/dbConfig'),
  { roleMap } = require('../../utils/maps');

const createUser = async (user) => {
  const query = `INSERT INTO person (name, surname, email, password, role_id) 
    VALUES ($1, $2, $3, $4, $5, crypt($6, 'password'), $7) RETURNING name, surname, email, role_id, person_id`;
  try {
    const result = await sendQuery(query, [
      user.name,
      user.surname,
      user.email,
      user.password,
      roleMap.user,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getUser = async (email, password = null) => {
  const query = password
    ? `SELECT person_id, name, surname, email, role_id FROM person WHERE email = $1 AND password = $2`
    : `SELECT person_id, name, surname, email, role_id FROM person WHERE email = $1`;
  const queryParams = password ? [email, password] : [email];
  try {
    const result = await sendQuery(query, queryParams);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (person_id) => {
  const query = `SELECT person_id, name, surname, email, role_id FROM person WHERE person_id = $1`;
  try {
    const result = await sendQuery(query, [person_id]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getSession = async (person_id, session_id = null) => {
  const queryParameters = session_id ? [person_id, session_id] : [person_id];
  const query = session_id
    ? `SELECT session_id, person_id, expiration_date FROM sessions WHERE person_id = $1 AND session_id = $2`
    : `SELECT session_id, person_id, expiration_date FROM sessions WHERE person_id = $1`;
  try {
    const result = await sendQuery(query, queryParameters);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const createSession = async (person_id) => {
  const query = `INSERT INTO sessions (person_id, expiration_date) VALUES ($1, NOW() + INTERVAL '30 day') RETURNING session_id, expiration_date`;
  try {
    const result = await sendQuery(query, [person_id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteSession = async (session_id) => {
  const query = `DELETE FROM sessions WHERE session_id = $1`;
  try {
    await sendQuery(query, [session_id]);
  } catch (err) {
    throw err;
  }
};
const checkIfUserExists = async (email) => {
  const query = `SELECT person_id FROM person WHERE email = $1`;
  try {
    const result = await sendQuery(query, [email]);
    return !!result.rows[0];
  } catch (err) {
    throw err;
  }
};

const refreshSession = async (person_id) => {
  const query = `UPDATE sessions SET expiration_date = NOW() + INTERVAL '30 day' WHERE person_id = $1`;
  try {
    await sendQuery(query, [person_id]);
  } catch (err) {
    throw err;
  }
};

const getRole = async (person_id) => {
  const query = `SELECT role_id FROM person WHERE person_id = $1`;
  try {
    const result = await sendQuery(query, [person_id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  authDAO: {
    createUser,
    createSession,
    getSession,
    getUser,
    deleteSession,
    checkIfUserExists,
    refreshSession,
    getRole,
    getUserById,
  },
};
