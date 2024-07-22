import React from 'react'
import heroBg from "../assets/svg/herobg.svg";
import { motion } from "framer-motion"

const MainPage = () => {
    return (
        <div>
            <div className="container vh-100">
                <div className="row align-items-center mt-5">
                    <div className="col-sm-6 p-5 align-self-center">
                        <h3>Welcome to <span style={{ fontFamily: "Playwrite CU , cursive" }}>ShareEase</span>: The Ultimate File Sharing Solution</h3>
                        <h4 className='text-secondary'>Effortless Sharing, Unmatched Security</h4>
                        <p style={{ textAlign: "justify", fontSize: "16px" }}>At ShareEase, we believe in making file sharing simple, fast, and secure.
                            Whether you're collaborating with colleagues, sharing memories with friends, or managing your personal documents, ShareEase offers a seamless experience tailored to your needs.</p>
                        <ul className='text-secondary' style={{ fontSize: "16px" }}>
                            <li><b>Sign Up:</b> Create a free account with just a few clicks.</li>
                            <li><b>Upload:</b> Drag and drop your files into our secure cloud storage.</li>
                            <li><b>Share:</b> Send links to your files with ease.</li>
                        </ul>
                    </div>
                    <div className="col-sm-6">
                        <motion.img
                            initial="hidden"
                            whileInView={"visible"}
                            variants={{
                                visible: {
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        duration: 1,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    },
                                },
                                hidden: { opacity: 1, y: 20 },
                            }}
                            src={heroBg}
                            alt=""
                            className="md:w-3/6 hidden sm:block bg-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage
