const { Router } = require("express");
const multer = require("multer");
const moment = require("moment");
const path = require("path");
const Blog = require("../models/blog");



const router = Router();
// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));;
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename)
    },
})
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('createdBy','name')

        res.render('home', {
            blogs: blog,
            user: req.user,
            moment: moment
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// add blog get
router.get('/add-blog', (req, res) => {
    try {
        return res.render('blog', {
            user: req.user,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
})
// add blog post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file.filename;
        const blog = await Blog.create({
            title: title,
            description: description,
            image: `/uploads/${image}`,
            createdBy: req.user._id
        })
        return res.redirect(`/blog/${blog._id}`);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
})
// get blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        return res.render('blog-details', {
            blog: blog,
            user: req.user,
            moment: require('moment')
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});
// edit blog get
router.get('/edit-blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        // if (!blog.createdBy || blog.createdBy.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ error: "Unauthorized" });
        // }

        return res.render('edit-blog', {
            blog: blog,
            user: req.user,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
})

// edit blog post
router.post('/edit-blog/:id', upload.single('image'), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ error: "Blog not found" });
        }
        // if (!blog.createdBy || blog.createdBy.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ error: "Unauthorized" });
        // }
        const { title, description } = req.body;
        if (req.file) {
            blog.image = `/uploads/${req.file.filename}`; s
        }

        blog.title = title;
        blog.description = description;
        // blog.image = `/uploads/${image}`;

        await blog.save();
        return res.redirect(`/blog/${blog._id}`);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
})








module.exports = router;