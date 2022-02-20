
// These helper functions operate under the assumption that they
// won't be used unless the request is valid & authenticated.
// (They simply do as they're told, ensure authentication etc. before use)
const dbHelpers = (db) => {

  // Get all running simulations (teacher joined)
  const getRunningSimulations = () => {
    return db.query(`SELECT * FROM simulations JOIN teachers ON simulations.teacher_id = teachers.id WHERE is_playing = TRUE`).then(data => data.rows);
  };

  return { getRunningSimulations };
};

module.exports = dbHelpers;