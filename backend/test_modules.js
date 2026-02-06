try {
    require('express');
    console.log('express OK');
    require('cors');
    console.log('cors OK');
    require('body-parser');
    console.log('body-parser OK');
    require('dotenv');
    console.log('dotenv OK');
    require('pg');
    console.log('pg OK');
    require('bcryptjs');
    console.log('bcryptjs OK');
    console.log('All modules OK');
} catch (e) {
    console.error(e);
}
