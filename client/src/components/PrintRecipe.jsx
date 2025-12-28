import React from 'react';
import { Printer } from 'lucide-react';
import { motion } from 'framer-motion';

const PrintRecipe = ({ recipe }) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${recipe.title} - BrewVibe</title>
                <style>
                    @media print {
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        .no-print { display: none; }
                    }
                    body {
                        font-family: 'Georgia', serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #4B3621;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        font-size: 2.5em;
                        color: #4B3621;
                        margin: 0;
                    }
                    .header p {
                        color: #666;
                        font-size: 1.1em;
                        margin: 10px 0;
                    }
                    .meta {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin: 20px 0;
                        flex-wrap: wrap;
                    }
                    .meta-item {
                        padding: 8px 16px;
                        background: #f5f5f5;
                        border-radius: 8px;
                        font-weight: bold;
                    }
                    .image {
                        width: 100%;
                        max-width: 600px;
                        height: 400px;
                        object-fit: cover;
                        border-radius: 10px;
                        margin: 20px auto;
                        display: block;
                    }
                    .section {
                        margin: 30px 0;
                    }
                    .section h2 {
                        color: #4B3621;
                        font-size: 1.8em;
                        border-bottom: 2px solid #4B3621;
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                    }
                    .ingredients ul {
                        list-style: none;
                        padding: 0;
                    }
                    .ingredients li {
                        padding: 10px;
                        margin: 5px 0;
                        background: #f9f9f9;
                        border-left: 4px solid #4B3621;
                        border-radius: 4px;
                    }
                    .instructions ol {
                        padding-left: 20px;
                    }
                    .instructions li {
                        padding: 15px;
                        margin: 10px 0;
                        background: #f9f9f9;
                        border-radius: 8px;
                        line-height: 1.6;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 0.9em;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${recipe.title}</h1>
                    <p>${recipe.description || ''}</p>
                    <div class="meta">
                        <span class="meta-item">⏱️ ${recipe.prepTime} min</span>
                        <span class="meta-item">📊 ${recipe.difficulty}</span>
                        ${recipe.calories ? `<span class="meta-item">🔥 ${recipe.calories} cal</span>` : ''}
                        ${recipe.rating > 0 ? `<span class="meta-item">⭐ ${recipe.rating.toFixed(1)}</span>` : ''}
                    </div>
                </div>
                
                ${(() => {
                    const images = recipe.images && recipe.images.length > 0 
                        ? recipe.images 
                        : (recipe.image || recipe.imageUrl ? [recipe.image || recipe.imageUrl] : []);
                    
                    if (images.length > 0) {
                        return images.map((img, idx) => 
                            `<img src="${img}" alt="${recipe.title} - Image ${idx + 1}" class="image" style="margin-bottom: ${idx < images.length - 1 ? '20px' : '0'};" />`
                        ).join('');
                    }
                    return '';
                })()}
                
                <div class="section ingredients">
                    <h2>Ingredients</h2>
                    <ul>
                        ${Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
                            ? recipe.ingredients.map(ing => {
                                const ingObj = typeof ing === 'object' ? ing : { name: ing, amount: '', unit: '' };
                                return `<li><strong>${ingObj.name}</strong>${ingObj.amount ? ` - ${ingObj.amount} ${ingObj.unit || ''}` : ''}</li>`;
                            }).join('')
                            : '<li>No ingredients listed</li>'
                        }
                    </ul>
                </div>
                
                <div class="section instructions">
                    <h2>Instructions</h2>
                    <ol>
                        ${Array.isArray(recipe.instructions) && recipe.instructions.length > 0
                            ? recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')
                            : '<li>No instructions available</li>'
                        }
                    </ol>
                </div>
                
                <div class="footer">
                    <p>Printed from BrewVibe - Premium Beverage Recipes</p>
                    <p>${new Date().toLocaleDateString()}</p>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-coffee-900 text-white rounded-xl font-semibold hover:bg-coffee-800 transition-colors"
        >
            <Printer size={20} />
            Print Recipe
        </motion.button>
    );
};

export default PrintRecipe;

