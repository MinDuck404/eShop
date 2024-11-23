const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    images:[
        {
            type:String,
        }
    ],
    color:{
        type:String,
    },
    parentCatName:{
        type:String,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
      }
},{timestamps:true})

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);
exports.categorySchema = categorySchema;
