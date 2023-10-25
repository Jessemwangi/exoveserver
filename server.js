// import axios from 'axios';
import { products } from './data.js';
import { db } from './dbConnect.js';
// const url = 'https://www.exove.com/sample/interviewdata';
const translations = [
    { language: 'eng', text: '' },
    { language: 'fin', text: '' },
    { language: 'swa', text: '' },
    { language: 'fra', text: '' },
]

// Get data from endpoint
// const fetchDataFromAPI = async () => {
//     try {
//         const { data } = await axios.get(url)
//         return data;
//     } catch (error) {
//         throw new Error('Failed to fetch data from the API: ' + error.message);
//     }
// };

// get data from the database
// const fetchExistingDataFromDatabase = async () => {
//     try {
//         const q = 'select * from products'

//        db.query(q, (err, data) => {

//             if (err) {
//                 throw new Error(err)

//             }
//             if (data) {
//                 console.log("we hab data")
//                 const products = data.map(row => ({ ...row }));
//                return products
//             }
//             else{
//                 return []
//             } 
//         })
       
//     } catch (error) {
//         throw new Error('Failed to fetch data from the the Database: ' + error.message);
//     }
// }
const fetchExistingDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
        const q = 'SELECT * FROM products';
        db.query(q, (err, data) => {
            if (err) {
                reject(new Error(err));
            } else if (data) {
                const products = data.map(row => ({ ...row }));
                resolve(products);
            } else {
                resolve([]);
            }
        });
    }).catch(error => {
        throw new Error('Failed to fetch data from the Database: ' + error.message);
    });
};

const postCategory = async (newData) => {

    try {
        const categories = newData.products?.flatMap(p => p.categories)
            .reduce((acc, category) => {
                if (!acc[category.id]) {
                    acc[category.id] = category;
                }
                return acc;
            }, {});

        // Insert categories
        Object.values(categories).forEach(async category => {
            let categoryId = category.id
            let name = category.name
            const q = `SELECT COUNT(*) AS count FROM categories WHERE id = ?`
            const q2 = 'INSERT INTO categories (id, name) VALUES (?, ?)';
            db.query(q, categoryId, (error, result) => {
                if (error) {
                    console.error(error);
                    return false;
                } else {
                    if (result[0].count === 0) {

                        db.query(q2, [categoryId, name], (error, data) => {
                            if (error) {
                                console.error(error);
                                return false;
                            }
                        })

                    }
                }
            })

        });
        // then we call the insert product and other collection transaction to avoid products lucking categories
        postData(newData)
    } catch (error) {
        console.log(error)
    }
}

// Function to insert data
const postData = async (newData) => {
    await db.query('START TRANSACTION');
    try {
        newData.products.forEach(async product => {

            // Parse variations, an product id to each varitions
            const variations = product.variations.map(v => {
                return {
                    productid: product.id,
                    ...v
                };
            });

            // transacting product data to the db
            await db.query('INSERT INTO products (id, name, description) VALUES (?, ?, ?)',
                [product.id, product.name, product.description]);

            // insert product into category
            product.categories.forEach(async cat => {
                await db.query('INSERT INTO productCategories (productid, categoryid) VALUES (?, ?)',
                    [product.id, cat.id]);
            })
            // add translations placeholder
            for (const translation of translations) {
                await db.query('INSERT INTO product_translations (productid, language, translation) VALUES (?, ?, ?)',
                    [product.id, translation.language, translation.text]);
            }

            // insert the variations which include product id and dynamic key value pairs

            variations.forEach(async (v) => {

                const productid = v.productid;

                if (Object.keys(v).length === 2 && v.hasOwnProperty('productid') && v.hasOwnProperty('price')) {
                    // If the variation has only "product_id" and "price," insert "price" separately
                    const key_name = 'Product price';
                    const value_name = 'default';
                    const price = v.price;
                    await db.query('INSERT INTO variations (productid, price,currency, key_name,value_name) VALUES (?, ?, ?, ?, ?)',
                        [productid, price, 'EUR', key_name, value_name]);

                } else {

                    // Handle variations with other properties as tby extracting the key pair and store them in db
                    for (const [key, value] of Object.entries(v)) {
                        if (key !== 'productid' && key !== 'price') {
                            await db.query('INSERT INTO variations (productid, price,currency, key_name,value_name) VALUES (?, ?, ?, ?, ?)',
                                [productid, v.price, 'EUR', key, value]);
                        }

                    }
                }
            }

            )
        });

        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        console.log(error);
    }
};

const updateDataFromAPI = async () => {
    try {
        let newData = products
        // const apiData = await fetchDataFromAPI();
        const apiData =products
        const dbData = await fetchExistingDataFromDatabase();
        if (dbData.length > 0) {
            const existingProductIds = dbData?.map(product => product.id);
            newData = apiData?.products?.filter(apiProduct => !existingProductIds?.includes(apiProduct.id));
console.log(newData)
        }
        // if (newData?.products?.length > 0) {
        //     await postCategory(newData);
        // }
    } catch (error) {
        console.error('Error while updating data from the API:', error);
    }
};

// const updateDataPeriodically = async () => {
//     setInterval(updateDataFromAPI, 5 * 60 * 1000);
// };

await updateDataFromAPI();

