"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import Image from "next/image"

type Message = {
  id: number
  sender: "user" | "creator"
  text: string
  timestamp: Date
  image?: string
}

type QuickReply = {
  id: number
  text: string
  nextId: number | null
}

// Function to parse text and convert **bold** to actual bold elements
const parseText = (text: string): ReactNode[] => {
  if (!text) return []

  // Split the text by the bold pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    // Check if this part is a bold text (surrounded by **)
    if (part.startsWith("**") && part.endsWith("**")) {
      // Extract the text between ** and **
      const boldText = part.slice(2, -2)
      return <strong key={index}>{boldText}</strong>
    }

    // Handle line breaks
    if (part.includes("\n")) {
      return part.split("\n").map((line, lineIndex, array) =>
        lineIndex < array.length - 1 ? (
          <span key={`${index}-${lineIndex}`}>
            {line}
            <br />
          </span>
        ) : (
          <span key={`${index}-${lineIndex}`}>{line}</span>
        ),
      )
    }

    // Return regular text
    return part
  })
}

export default function ChatExperience() {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [availableReplies, setAvailableReplies] = useState<QuickReply[]>([])

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // The conversation flow data
  const conversationData = [
    {
      id: 0,
      creatorMessage:
        "Hi there! I'm Bob Metcalfe, and I'm working on the first attempt to create something called a **Local Area Network**, or **LAN** for short. I want to connect a few computers that are in the same room.\n\nWant to brainstorm with me on how we can build it?",
      quickReplies: [{ id: 1, text: "Sure, but why would we even want to connect computers?", nextId: 2 }],
    },
    {
      id: 2,
      creatorMessage:
        "At the moment, if someone working on one of these computers wants to share their work, they have to copy everything to a disk and physically walk it over to the other computer. Also, each computer needs its own printer, which is not only expensive but takes up valuable floor space.",
      image: "/images/early-computers.png",
      quickReplies: [{ id: 3, text: "Ok, so??", nextId: 4 }],
    },
    {
      id: 4,
      creatorMessage:
        "By connecting these computers, people could instantly send files back and forth without leaving their desks, and they could all share a single printer. This would cut down on equipment costs and free up space in the room.\n\nI can also think of another benefit - people could send each other quick messages directly through the computers, allowing them to communicate instantly without leaving their desks.",
      quickReplies: [
        {
          id: 5,
          text: "Okay, cool. So where do we start? How do we connect them, like with a wire or something?",
          nextId: 6,
        },
      ],
    },
    {
      id: 6,
      creatorMessage:
        "Yep, a wire's pretty much our only option right now. I think we should use a coaxial cable (like what's used for connecting TVs to satellite dishes) because it's good at keeping the signals clear by blocking stuff that could mess them up, like other electronics in the room.\n\nIn networking terms, the wire is called the **transmission medium**. It's the physical path the data travels through to get from one computer to another.",
      image: "/images/coaxial-cable.png",
      quickReplies: [{ id: 7, text: "OK, so what's the next step?", nextId: 8 }],
    },
    {
      id: 8,
      creatorMessage:
        "We need to figure out how we are going to hook up the computers..\n🔗 We could run one long wire in a straight line and tap all the computers into it.\n🌟 Or we could use a device in the middle and connect each computer to that with its own wire.\n🔄 Or we could link every computer directly to all the others with wires.\nI think the straight-line idea might be simpler to start with.",
      image: "/images/network-topologies-new.png",
      quickReplies: [
        {
          id: 9,
          text: "Let me guess, there's a fancy networking word for how we hook them up, right? 😏",
          nextId: 10,
        },
      ],
    },
    {
      id: 10,
      creatorMessage:
        "Yep, there is! It's called the **topology**. That's the name for how computers are arranged and connected in a network.",
      quickReplies: [
        {
          id: 11,
          text: "Got it. Now, data is stored as 1s and 0s inside a computer. How do we send those 1s and 0s through a wire?",
          nextId: 12,
        },
      ],
    },
    {
      id: 12,
      creatorMessage:
        "Good question! We could use voltage to represent them. Like, maybe 5 volts means a 1, and 0 volts means a 0. That way, the wire carries electrical signals that match the data.",
      image: "/images/voltage-binary-new.png",
      quickReplies: [
        {
          id: 13,
          text: "So, we are going to hook up these computers in a straight line using a wire. Do computers already have a spot to plug this wire into?",
          nextId: 14,
        },
      ],
    },
    {
      id: 14,
      creatorMessage:
        "Not quite! Computers don't come with a built-in spot for the wire yet.\n\nWe'd need to add a socket on the computer. Then, we'd put a matching connector or plug on the end of the wire so it fits perfectly into that socket, kind of like how a charger fits your phone.\n\nAlso, inside the computer, we'd need a new hardware component!",
      quickReplies: [{ id: 15, text: "Why is that?", nextId: 16 }],
    },
    {
      id: 16,
      creatorMessage:
        "Because something needs to convert the 1s and 0s inside the computer to electrical signals that travel on the wire!\n\nWe'll add a hardware piece called a **Network Interface Card**, or **NIC**. It'll turn those 1s and 0s into signals to send and turn incoming signals back into 1s and 0s for the computer to understand.",
      image: "/images/nic-card.jpeg",
      quickReplies: [{ id: 17, text: "Okay, so what have we sorted out so far?", nextId: 18 }],
    },
    {
      id: 18,
      creatorMessage:
        "Good question! Let's see—we've decided on:\n\n✅ Connect all the computers with one wire in a straight line\n✅ Use voltage to send the 1s and 0s (5 volts for a 1 and 0 volts for a 0)\n✅ Add a socket to each computer for the wire connection\n✅ Install a NIC in each computer to handle the signals\n\nThat's our setup so far!\n\nOh, by the way, I just thought of an issue we might run into.",
      quickReplies: [{ id: 19, text: "What's that?", nextId: 20 }],
    },
    {
      id: 20,
      creatorMessage: "What happens if two computers try sending data on the wire at the same time?",
      quickReplies: [{ id: 21, text: "Why's that a problem?", nextId: 22 }],
    },
    {
      id: 22,
      creatorMessage:
        "If they both send signals, the voltages could overlap and get all jumbled up. It'd be like two people shouting over each other. You wouldn't understand either one.",
      quickReplies: [{ id: 23, text: "Oh, I see. So how do we fix that?", nextId: 24 }],
    },
    {
      id: 24,
      creatorMessage:
        "We need a rule so only one computer sends at a time.\n\nMaybe the NIC can check the wire first. If it's quiet, it sends the data. If it hears something already on the wire, it waits a bit and tries again.",
      quickReplies: [
        {
          id: 25,
          text: "That sounds smart. But could two computers still accidentally send at the exact same moment?",
          nextId: 26,
        },
      ],
    },
    {
      id: 26,
      creatorMessage:
        "It's not very likely, but yeah, it could happen if they both check at the same time and think it's clear.",
      quickReplies: [{ id: 27, text: "Okay, so what happens if they do?", nextId: 28 }],
    },
    {
      id: 28,
      creatorMessage:
        "If that happens, the signals would smash into each other and get all scrambled. The data would be a mess, and no one would understand it.\n\nWe need a way to spot when this happens. Maybe the hardware could listen after sending and check if what it hears matches what it sent. If it's garbled, it knows there was a **collision** and can try again later.",
      quickReplies: [
        {
          id: 29,
          text: "Got it! Btw, with this single-line setup, when a computer sends a document to the printer, won't every computer get it? How will the printer know it's for it and the others ignore it?",
          nextId: 30,
        },
      ],
    },
    {
      id: 30,
      creatorMessage:
        "Oh, good point! Since everyone's on the same wire, they'll all see the data.\n\nWe could give each device, like computers and the printer, a unique ID number. When data's sent, it includes the ID of who it's for, so the printer listens only if it's its ID, and others ignore it if it's not theirs.",
      quickReplies: [
        { id: 31, text: "I get it. So when data's sent, it includes the ID of who it's going to?", nextId: 32 },
      ],
    },
    {
      id: 32,
      creatorMessage: 'Exactly! The data would say, "Hey, this is for ID number 3," or whatever.',
      quickReplies: [
        { id: 33, text: "So the stream of 1s and 0s has the ID and the actual data together?", nextId: 34 },
      ],
    },
    {
      id: 34,
      creatorMessage: "Yep, that's the idea.",
      quickReplies: [{ id: 35, text: "So what exactly is this ID, then? Is it just a random number?", nextId: 36 }],
    },
    {
      id: 36,
      creatorMessage:
        "No, it's not just a random number. Each NIC (Network Interface Card) has its own unique ID, called a **MAC address**. The MAC address is built into the NIC and is specific to each device.\n\nSo when we send data, we will use the MAC address as the ID to make sure it gets to the right device.",
      quickReplies: [
        {
          id: 37,
          text: "Earlier, we talked about how the 1s and 0s sent across the wire represent both the data and the ID of the receiving computer. How do the computers know which part is the ID and which is the data?",
          nextId: 38,
        },
      ],
    },
    {
      id: 38,
      creatorMessage:
        "Oh, good catch! We'd need to set up a format, like, the first few 1s and 0s are always the ID, and everything after is the data. We'll have to agree on how many digits the ID gets so everyone's on the same page.",
      image: "/images/data-format-new.png",
      quickReplies: [
        { id: 39, text: "Got it. Should we also send the ID of the computer sending the data?", nextId: 40 },
      ],
    },
    {
      id: 40,
      creatorMessage:
        "Yeah, that's a smart idea!\n\nThat way, the receiver knows who it's from. So the stream would have the sender's ID, the receiver's ID, and then the data.",
      image: "/images/frame-format-new.png",
      quickReplies: [
        {
          id: 41,
          text: "Nice. People will use this to share a printer, right? What if someone sends a huge document won't it clog the wire?",
          nextId: 42,
        },
      ],
    },
    {
      id: 42,
      creatorMessage: "You're right! It could tie up the wire for a while, which would be annoying for everyone else.",
      quickReplies: [
        { id: 43, text: "How do we deal with that? It'd be a pain if the network's stuck all the time.", nextId: 44 },
      ],
    },
    {
      id: 44,
      creatorMessage:
        "True. Maybe we break big data into smaller chunks. Let's call each chunk a **Frame**. Each frame gets sent separately with the IDs and a piece of the message. That way, other computers can sneak their data in between.",
      image: "/images/data-frames-new.png",
      quickReplies: [
        {
          id: 45,
          text: "Okay, I like that. But how will the receiving computer know what order to put those chunks in?",
          nextId: 46,
        },
      ],
    },
    {
      id: 46,
      creatorMessage:
        'Good question! We could add a tiny number to each packet, like "Frame 1," "Frame 2," so the receiver can stitch them back together in the right order.',
      quickReplies: [
        {
          id: 47,
          text: "That works. Oh, by the way, could data get messed up on the wire? Like, a 1 turning into a 0 or something getting lost?",
          nextId: 48,
        },
      ],
    },
    {
      id: 48,
      creatorMessage:
        "Yeah, that can happen. Wires aren't perfect! Electrical noise or a bad connection could flip a bit here or there.",
      quickReplies: [{ id: 49, text: "How do we make sure the receiver gets the right data?", nextId: 50 }],
    },
    {
      id: 50,
      creatorMessage:
        "We could add a little check at the end of each packet. Like, count up the 1s in the data and send that number along. The receiver does the same count, if it matches, the data's good. If not, something's off.",
      quickReplies: [
        { id: 51, text: "Cool, that makes sense. But what does the receiver do if the data's wrong?", nextId: 52 },
      ],
    },
    {
      id: 52,
      creatorMessage:
        'Hmm, I think it should ask the sender to try again. Like, "Hey, that frame didn\'t add up, send it one more time."',
      quickReplies: [{ id: 53, text: "Perfect. I think we've got a solid plan here!", nextId: 54 }],
    },
    {
      id: 54,
      creatorMessage:
        "Yeah, me too! We've got the wire, details of the socket and the connector, the voltage signals, collision handling, IDs, frames, order numbers, and a way to check for errors. It's starting to sound like a real network!",
      quickReplies: [{ id: 55, text: "Cool!", nextId: 56 }],
    },
    {
      id: 56,
      creatorMessage:
        "If everyone follows the process and rules we've come up with, the whole thing works.\n\nThese rules are called **protocols**.\n\nThey cover everything from what kind of wire and socket we use to how data is sent, how we check for problems, and how we put it all back together at the other end. Without protocols, none of the parts would know what to do.",
      quickReplies: [
        {
          id: 57,
          text: "Got it! One thing though! I can see that the NIC is physically transporting the data across the wire, but who handles the other parts?",
          nextId: 58,
        },
      ],
    },
    {
      id: 58,
      creatorMessage:
        "Good catch! The chopping into frames, giving each one a part number, adding the sender and receiver IDs, and working out a number to show if the frame's okay, then sticking that on too is handled by software. This software then hands each frame to the NIC.",
      quickReplies: [{ id: 59, text: "Ohh OK! And what about on the receiving side?", nextId: 60 }],
    },
    {
      id: 60,
      creatorMessage:
        "On the receiving side, the NIC picks up the 1s and 0s from the wire and puts them into frames.\n\nThen it passes those frames to the software, which checks the number, called the **checksum**, to see if each frame arrived okay. If one's messed up, it asks the sender to resend it. If they're all good, it uses the part numbers to put them back together in order.",
      quickReplies: [
        {
          id: 61,
          text: "So the job of moving data from one computer to another computer or a printer is broken into two steps?",
          nextId: 62,
        },
      ],
    },
    {
      id: 62,
      creatorMessage:
        "Exactly. One step is handled by the NIC and the other is handled by the software. And if each one, on all the computers and the printer, follows the rules we've defined, then data can be transported reliably and quickly. 🚀\n\nThese steps are called **layers** in networking jargon. Each layer has its own job and its own set of rules to follow, which makes the whole system easier to build, fix, and understand. 🧩",
      image: "/images/network-layers.png",
      quickReplies: [
        {
          id: 63,
          text: "So can we actually start using this network now? Like to share files or print stuff?",
          nextId: 64,
        },
      ],
    },
    {
      id: 64,
      creatorMessage:
        "Yep! Now that our system is set up, other programs can use it. 🖥️🖨️ Say you're writing a document and want to print it. The writing program doesn't worry about how to send the data. It just tells our network software, \"Hey, send this to the printer.\" 📄➡️🖨️\n\nThe software turns the document into frames and hands them to the NIC. The NIC sends them over the wire. On the other end, the printer's NIC picks them up and passes them to its software, which puts everything back together and gets it ready to print. 🎯\n\nSo yeah… congratulations — you've just helped design your own working network from scratch. Not bad for a first try. I'd say you're thinking like a real network engineer. 🧠⚡",
      quickReplies: [{ id: 65, text: "Start over", nextId: 0 }],
    },
  ]

  const startChat = () => {
    setStarted(true)
    // Add the initial message from the creator
    const initialData = conversationData.find((item) => item.id === 0)
    if (initialData) {
      setMessages([
        {
          id: 0,
          sender: "creator",
          text: initialData.creatorMessage,
          timestamp: new Date(),
        },
      ])
      setAvailableReplies(initialData.quickReplies)
    }
  }

  const handleQuickReply = (reply: QuickReply) => {
    // Add the user's question to the messages
    const newMessages = [
      ...messages,
      {
        id: messages.length,
        sender: "user",
        text: reply.text,
        timestamp: new Date(),
      },
    ]

    setMessages(newMessages)

    // Find the creator's response based on the nextId
    if (reply.nextId !== null) {
      const nextData = conversationData.find((item) => item.id === reply.nextId)
      if (nextData) {
        // Add a slight delay to simulate typing
        setTimeout(() => {
          setMessages([
            ...newMessages,
            {
              id: newMessages.length,
              sender: "creator",
              text: nextData.creatorMessage,
              timestamp: new Date(),
              image: nextData.image,
            },
          ])
          setAvailableReplies(nextData.quickReplies)
        }, 500)
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  if (!started) {
    return (
      <div className="flex items-center justify-centre min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-centre">Chat with the Creator of the First LAN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Step back in time to the early 1970s and chat with one of the pioneers who created the first local area
              networks. Learn how they solved the fundamental challenges of connecting computers together.
            </p>
            <p className="text-muted-foreground">
              Ask questions about how data is transmitted, how computers identify each other, and how they avoid
              conflicts when sharing the same wire.
            </p>
            <div className="pt-4">
              <Button onClick={startChat} className="w-full">
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50">
      {/* Chat header */}
      <div className="border-b bg-white p-4 flex items-centre space-x-4">
        <Avatar className="h-10 w-10 border">
          <div className="flex h-full w-full items-centre justify-centre bg-muted text-muted-foreground">BM</div>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Bob Metcalfe</h2>
          <p className="text-sm text-muted-foreground">Creator of Ethernet</p>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="mb-1">{parseText(message.text)}</div>
                {message.image && (
                  <div className="mt-3 mb-3">
                    <Image
                      src={message.image || "/placeholder.svg"}
                      alt="Network diagram"
                      width={600}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                )}
                <div
                  className={`text-xs ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick replies with send buttons */}
      <div className="border-t bg-white p-4">
        <div className="space-y-3">
          {availableReplies.map((reply) => (
            <div key={reply.id} className="flex items-centre gap-2">
              <div
                onClick={() => handleQuickReply(reply)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:bg-muted"
              >
                {reply.text}
              </div>
              <Button size="icon" onClick={() => handleQuickReply(reply)} className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
