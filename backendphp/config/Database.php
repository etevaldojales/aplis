<?php
class Database {
    private $host = "127.0.0.1";
    private $db_name = "aplis_db";
    private $username = "root"; // Substitua pelo usuário
    private $password = "";     // Substitua pela senha
    public $conn;
    

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Erro na conexão: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
?>