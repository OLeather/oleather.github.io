var h1 = document.getElementsByTagName("h1");
for (const e of h1) {
    e.classList.add("text-black");
    e.classList.add("dark:text-white");
    e.classList.add("text-5xl");
    e.classList.add("text-center");
    e.classList.add("w-full");
    e.classList.add("p-3");
}

var h2 = document.getElementsByTagName("h2");
for (const e of h2) {
    e.classList.add("text-black");
    e.classList.add("dark:text-white");
    // e.classList.add("text-center");
    e.classList.add("w-full");
    e.classList.add("text-3xl");
}

for (const e of document.getElementsByTagName("h4")){
    e.classList.add("w-full");
    e.classList.add("text-center");
    e.classList.add("text-gray-700");
    e.classList.add("dark:text-gray-400");
    e.classList.add("pt-0");
    e.classList.add("pb-3");
    // e.classList.add("underline");
    // e.classList.add("underline-offset-8");
}

for (const e of document.getElementsByTagName("hr")){
    e.classList.add("h-1");
    e.classList.add("mx-auto");
    e.classList.add("w-40");
    e.classList.add("pt-0");
    e.classList.add("bg-gray-100");
    e.classList.add("border-0");
    e.classList.add("rounded");
    e.classList.add("dark:bg-gray-700");
}

var p = document.getElementsByTagName("p");
for (const e of p) {
    e.classList.add("text-black");
    e.classList.add("dark:text-white");
    e.classList.add("w-full");
}

for (const e of document.getElementsByTagName("video")) {
    e.classList.add("rounded-lg");
    e.classList.add("shadow-lg");
    e.classList.add("self-center");
    e.classList.add("mx-auto");
}

for (const e of document.getElementById("contentDiv").getElementsByTagName("a")) {
    e.classList.add("underline");
    e.classList.add("dark:text-violet-300");
    e.classList.add("text-violet-700");
}

for (const e of document.getElementsByTagName("img")) {
    e.classList.add("rounded-lg");
    e.classList.add("shadow-lg");
    e.classList.add("self-center");
    e.classList.add("mx-auto");
}

var pre = document.getElementsByTagName("pre");
for (const e of pre) {
    e.classList.add("bg-gray-200");
    e.classList.add("dark:bg-gray-900");
    e.classList.add("dark:text-white");
    e.classList.add("overflow-auto");
    e.classList.add("p-3");
    e.classList.add("clear-left");
    e.classList.add("w-full");
    e.classList.add("w-max-full");
    e.classList.add("rounded-lg");
    e.classList.add("shadow-lg");
}

var code = document.getElementsByTagName("code");
for (const e of code) {
    e.classList.add("bg-gray-200");
    e.classList.add("dark:bg-gray-900");
    e.classList.add("dark:text-white");
    e.classList.add("p-0");
}

for (const e of document.getElementsByClassName("sourceCode")) {
    e.classList.add("w-full");
    e.classList.add("p-0");
}

/* KeyWordTok */
// .sourceCode .kw { color: #600095; }
var kw = document.getElementsByClassName("kw");
for (const e of kw) {
    e.classList.add("text-[#600095]");
    e.classList.add("dark:text-[#600095]");
}

// /* DataTypeTok */
// .sourceCode .dt { color: #268BD2; }
var dt = document.getElementsByClassName("dt");
for (const e of dt) {
    e.classList.add("text-[#268BD2]");
    e.classList.add("dark:text-[#268BD2]");
}

// /* DecValTok (decimal value), BaseNTok, FloatTok */
// .sourceCode .dv, .sourceCode .bn, .sourceCode .fl { color: #AE81FF; }
var dv = document.getElementsByClassName("dv");
for (const e of dv) {
    e.classList.add("text-[#AE81FF]");
    e.classList.add("dark:text-[#AE81FF]");
}
// /* CharTok */
// .sourceCode .ch { color: #37ad2d; }
var ch = document.getElementsByClassName("ch");
for (const e of ch) {
    e.classList.add("text-[#37ad2d]");
    e.classList.add("dark:text-[#37ad2d]");
}
// /* StringTok */
// .sourceCode .st { color: #37ad2d; }
var st = document.getElementsByClassName("st");
for (const e of st) {
    e.classList.add("text-[#37ad2d]");
    e.classList.add("dark:text-[#37ad2d]");
}
// /* CommentTok */
// .sourceCode .co { color: #7E8E91; }
var co = document.getElementsByClassName("co");
for (const e of co) {
    e.classList.add("text-[#7E8E91]");
    e.classList.add("dark:text-[#7E8E91]");
}
// /* OtherTok */
// .sourceCode .ot { color: #EB005B; }
var ot = document.getElementsByClassName("ot");
for (const e of ot) {
    e.classList.add("text-[#EB005B]");
    e.classList.add("dark:text-[#EB005B]");
}
// /* AlertTok */
// .sourceCode .al { color: #A6E22E; font-weight: bold; }
var al = document.getElementsByClassName("al");
for (const e of al) {
    e.classList.add("text-[#A6E22E]");
    e.classList.add("dark:text-[#A6E22E]");
    e.classList.add("font-bold");
}
// /* FunctionTok */
// .sourceCode .fu { color: #333; }
var fu = document.getElementsByClassName("fu");
for (const e of fu) {
    e.classList.add("text-[#333]");
    e.classList.add("dark:text-[#999]");
}
// /* RegionMarkerTok */
// .sourceCode .re { }
var re = document.getElementsByClassName("re");
for (const e of re) {
}
// /* ErrorTok */
// .sourceCode .er { color: #E6DB74; font-weight: bold; }
var er = document.getElementsByClassName("er");
for (const e of er) {
    e.classList.add("text-[#E6DB74]");
    e.classList.add("dark:text-[#E6DB74]");
    e.classList.add("font-bold");
}
