/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function(knex) {
  await knex.schema.createTable('multicloud_environments', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('grouping_tag').notNullable();
    table.json('instances_json').notNullable();
    table.timestamp('last_updated').defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('multicloud_environments');
};
