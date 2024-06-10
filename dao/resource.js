import { DataTypes } from 'sequelize';

/**
 * 
 * @param { import('sequelize').Sequelize } sequelize 
 * @returns { import('sequelize').Model }
 */
function initResource(sequelize) {
  const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sell: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    y_min: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    y_max: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    v_min: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    v_max: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    w_min: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    w_max: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'resources',
    timestamps: false,
  });

  return Resource;
}

export { initResource };
