const express = require("express");

const router = express.Router();


const {createWorkout,
    getWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout} = require("../controllers/workoutController")
router.get("/",getWorkouts)


router.get("/:id",getWorkout)


router.post("/",createWorkout)


router.patch("/:id",updateWorkout)


router.delete("/:id",deleteWorkout)


module.exports = router;