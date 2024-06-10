import { DataTypes, Sequelize } from 'sequelize';

/**
 * 
 * @param { import('sequelize').Sequelize } sequelize 
 * @returns { import('sequelize').Model }
 */
function initUser(sequelize) {
  const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
}

export { initUser };
