const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: { // Field to store a URL-friendly version of the product name (and category)
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    // For this example, category is a string.
    // If you are referencing another collection (e.g., Category), adjust the type and slug logic accordingly.
    category: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
    },
    imageUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Pre-save hook to generate a slug based on the product name and category
productSchema.pre('save', function (next) {
    // Generate slug from the product name
    this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true
    });

    // If a category is provided, append a slugified version of the category to the slug.
    if (this.category) {
        const extraInfo = this.category.toLowerCase().replace(/\s+/g, '-');
        this.slug = `${this.slug}-${extraInfo}`;
    }

    // Update the updatedAt timestamp
    this.updatedAt = Date.now();

    next();
});

productSchema.index({
    name: 'text',
    description: 'text',
    category: 'text'
});

module.exports = mongoose.model('Product', productSchema);