import Icon from "./Icons"
import classNames from 'classnames'
import * as R from "ramda"
import { useEffect, useState } from "react"

//LIB IMPORT
import { hexToDec } from "/lib/Convertors/hexTodec"

//NEXT IMPORTS
import Link from "next/link";

const Post = ({ post }) => {

  const [vueImage, setVueImage] = useState(false)
  const [vueImageLink, setVueImageLink] = useState("")
  const [postAuthor, setPostAuthor] = useState({})

  const getAuthor = async () => {
    const response = await fetch("/api/user/get", {
      method: "POST",
      body: JSON.stringify({
        userId: post.author
      })
    })
    const responseJSON = await response.json()
    setPostAuthor(responseJSON.user)
  }

  useEffect(() => {
    getAuthor()
  }, [])


  const likePost = async () => {
    const request = await fetch("/api/post/like", {
      method: "POST",
      body: JSON.stringify({
        userId: "635e8de77363ad7d6636085e",
        postId: post._id
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })

    const requestJson = await request.json()
    alert(requestJson.message)
  }

  const actionsClass = classNames(
    'flex', 'flex-row', 'gap-2'
  )

  const buttonActionClass = classNames(
    'flex', 'flex-row', "text-lg"
  )

  const iconClass = classNames(
    'w-6', 'mr-1'
  )
  const date = new Date(post.createdAt)
  const day = date.getDay()
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return (
    <div>
      <Link
        href={{
          pathname: '/posts/[postId]',
          query: { postId: post._id },
        }}
      >
        {
          vueImage ?
            <div className="absolute top-0 left-0 h-screen w-screen flex justify-center items-center" onClick={
              () => {
                setVueImage(false)
                setVueImageLink("")
              }
            }>
              < img src={vueImageLink} alt="" className="z-10 max-w-3/4 max-h-screen w-auto h-3/4" />
              <div className="absolute w-screen h-screen bg-slate-600 opacity-70" />
            </div>
            : null}
        {/* USER */}
        <div className="max-h-[calc(100%/1.3)] bg-zinc-700 hover:bg-zinc-600 transition-all duration-100 p-1 border-y border-zinc-600">
          <div className="top p-2 " >
            <div className="user">
              <img src={postAuthor.avatar} alt="" className="userpfp" />
              <p className="userusername text-lg text-zinc-400">@{postAuthor.username}</p>
            </div>
            <div className="middle p-2 flex flex-col gap-4">
              <div className="text text-2xl">
                <p className="text-zinc-300">{post.content.text}</p>
              </div>
              <div className="image">
                {R.map((image) => {
                  return <img key={image} src={image} alt="" className="rounded-xl w-full lg:h-[430px] object-cover" onClick={() => {
                    setVueImage(true)
                    setVueImageLink(image)
                  }} />
                }, post.content.images)}
              </div>
            </div>
            <div className="bottom pb-2 flex flex-row justify-between">
              <p className="timestamp">{`${day} ${month} ${year} at ${hours} : ${minutes}`}</p>
              <div className={actionsClass}>
                <div className={buttonActionClass}>
                  <div className={iconClass}>
                    <Icon type="share" />
                  </div>
                  <p className="nbShare">{post.shared.length}</p>
                </div>
                <div className={buttonActionClass}>
                  {/* SVG comment */}
                  <div className={iconClass}>
                    <Icon type="comment" />
                  </div>
                  <p className="nbcomment">{post.comments.length}</p>
                </div>
                <div className={buttonActionClass}>
                  {/* SVG LIKE */}
                  <div className={iconClass}>
                    <Icon type="like" />
                  </div>
                  <p className="nbLikes">{post.likes.length}</p>
                </div>
              </div>
            </div >
          </div>
        </div >
      </Link >
    </div >
  )
}

export default Post