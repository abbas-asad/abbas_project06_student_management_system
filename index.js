#! /usr/bin/env node
import inquirer from "inquirer";
// Student class to encapsulate student details
class Student {
    id;
    name;
    coursesEnrolled;
    feesAmount;
    balance;
    feesPaid;
    constructor(id, name, coursesEnrolled, feesAmount) {
        this.id = id;
        this.name = name;
        this.coursesEnrolled = coursesEnrolled;
        this.feesAmount = feesAmount;
        this.balance = feesAmount;
        this.feesPaid = false;
    }
    displayInfo() {
        console.log(`\nStudent ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Courses Enrolled: ${this.coursesEnrolled.join(", ")}`);
        console.log(`Total Fees: $${this.feesAmount}`);
        console.log(`Balance: $${this.balance}`);
        console.log(`Fees Paid: ${this.feesPaid ? "Yes" : "No"}\n`);
    }
}
// StudentManagementSystem class to handle operations
class StudentManagementSystem {
    baseId = 10000;
    students = [];
    courses = [
        { name: "Information Technology", fee: 5000 },
        { name: "English Literature", fee: 500 },
        { name: "Arts", fee: 200 }
    ];
    // Method to start the system
    async start() {
        console.log("Welcome to the Student Management System!");
        let continueEnrollment = true;
        while (continueEnrollment) {
            const action = await inquirer.prompt({
                type: "list",
                name: "action",
                message: "Please select an option:",
                choices: ["Enroll a Student", "Show Student Status", "Pay Fees", "Exit"]
            });
            switch (action.action) {
                case "Enroll a Student":
                    await this.enrollStudent();
                    break;
                case "Show Student Status":
                    await this.showStudentStatus();
                    break;
                case "Pay Fees":
                    await this.payFees();
                    break;
                case "Exit":
                    console.log("Thank you for using the Student Management System!");
                    continueEnrollment = false;
                    break;
            }
        }
    }
    // Method to enroll a student
    async enrollStudent() {
        const studentNameAnswer = await inquirer.prompt({
            type: "input",
            name: "name",
            message: "Please enter your name:"
        });
        const studentName = studentNameAnswer.name.trim().toLowerCase();
        if (studentName === "") {
            console.log("Invalid name. Please try again.");
            return;
        }
        const existingStudent = this.students.find(student => student.name === studentName);
        if (existingStudent) {
            console.log("This name already exists. Please try another name.");
            return;
        }
        this.baseId++;
        const studentId = "STID" + this.baseId;
        console.log(`\nYour account has been created. Welcome, ${studentName}`);
        const courseChoices = this.courses.map(course => `${course.name} - $${course.fee}`);
        const courseAnswer = await inquirer.prompt({
            type: "list",
            name: "course",
            message: "Please select a course:",
            choices: courseChoices
        });
        const selectedCourse = this.courses.find(course => courseAnswer.course.includes(course.name));
        const courseName = selectedCourse?.name;
        const courseFee = selectedCourse?.fee;
        const confirmEnrollment = await inquirer.prompt({
            type: "confirm",
            name: "confirm",
            message: "Do you want to enroll in this course?"
        });
        if (confirmEnrollment.confirm && courseName && courseFee !== undefined) {
            const newStudent = new Student(studentId, studentName, [courseName], courseFee);
            this.students.push(newStudent);
            console.log("You have successfully enrolled in the course.");
        }
    }
    // Method to show student status
    async showStudentStatus() {
        if (this.students.length === 0) {
            console.log("No students enrolled yet.");
            return;
        }
        const studentNames = this.students.map(student => student.name);
        const selectedStudentAnswer = await inquirer.prompt({
            type: "list",
            name: "selectedStudent",
            message: "Please select a student name:",
            choices: studentNames
        });
        const selectedStudent = this.students.find(student => student.name === selectedStudentAnswer.selectedStudent);
        if (selectedStudent) {
            console.log("\nStudent Information:");
            selectedStudent.displayInfo();
        }
        else {
            console.log("Student not found.");
        }
    }
    // Method to pay fees
    async payFees() {
        if (this.students.length === 0) {
            console.log("No students enrolled yet.");
            return;
        }
        const studentNames = this.students.map(student => student.name);
        const selectedStudentAnswer = await inquirer.prompt({
            type: "list",
            name: "selectedStudent",
            message: "Please select a student name:",
            choices: studentNames
        });
        const selectedStudent = this.students.find(student => student.name === selectedStudentAnswer.selectedStudent);
        if (selectedStudent) {
            const paymentAmount = await inquirer.prompt({
                type: "number",
                name: "paymentAmount",
                message: "Enter the amount to pay:"
            });
            if (paymentAmount.paymentAmount > selectedStudent.balance) {
                console.log("Insufficient balance.");
                return;
            }
            selectedStudent.balance -= paymentAmount.paymentAmount;
            if (selectedStudent.balance === 0) {
                selectedStudent.feesPaid = true;
            }
            console.log("Fees paid successfully.");
        }
        else {
            console.log("Student not found.");
        }
    }
}
// Create an instance of StudentManagementSystem and start the system
const studentManagementSystem = new StudentManagementSystem();
studentManagementSystem.start();
