const express = require('express');
const router = express.Router();
const config = require('../../knexfile').development;
const knex = require('knex')(config);

router.get('/searchByTag', async (req, res) => {
    const tagString = req.query.tag;
    const tags = tagString.split(',').map(tag => tag.trim()); // Tách chuỗi thành một mảng các tag

    try {
        const recipes = await knex('recipes')
            .join('recipe_tags', 'recipes.id', '=', 'recipe_tags.recipe_id')
            .join('tags', 'tags.id', '=', 'recipe_tags.tag_id')
            .whereIn('tags.tag_name', tags)  // Sử dụng .whereIn() thay cho .where()
            .distinct('recipes.id', 'recipes.name')  // Sử dụng .distinct để loại bỏ các bản sao
            .select('recipes.*');

        res.status(200).json({ recipes });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get all tags
router.get('/getAllTags', async (req, res) => {
    try {
        const tags = await knex('tags').select('id', 'tag_name');
        res.status(200).json({ tags });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;